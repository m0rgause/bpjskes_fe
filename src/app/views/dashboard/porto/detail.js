import React from "react";
import {
  Card,
  Table,
  Spin,
  Typography,
  Row,
  Col,
  Button,
  DatePicker,
  Select,
  notification,
} from "antd";
import { Pie } from "@ant-design/plots";
import { ArrowLeftOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { get, post } from "../../../functions/helper";
import QueryString from "qs";

const useQuery = () => {
  let location = useLocation();
  return new URLSearchParams(location.search);
};

export function DetailPorto() {
  const query = useQuery();
  const subtipe = query.get("subtipe");
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs().add(6, "M"));
  const [filterIssuer, setFilterIssuer] = React.useState("all");
  const [issuer, setIssuer] = React.useState({ item: [], data: [] }); // for filter
  const [data, setData] = React.useState([]); // for table

  const isMobile = window.innerWidth <= 768;
  const [tab, setTab] = React.useState("tenor");
  const history = useNavigate();

  React.useEffect(() => {
    getIssuer();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async (key = "tenor") => {
    setLoading(true);
    let eq = {
      start: filterStartDate.format("YYYY-MM"),
      end: filterEndDate.format("YYYY-MM"),
      range: filterEndDate.diff(filterStartDate, "M"),
      issuer: filterIssuer,
      tableName: "trx_porto",
      subtipe: subtipe,
    };

    if (key === "kbmi") {
      eq.joinTable = "mst_kbmi";
    } else if (key === "tenor") {
      eq.joinTable = "mst_tenor";
    } else if (key === "kepemilikan") {
      eq.joinTable = "mst_kepemilikan";
    } else if (key === "pengelolaan") {
      eq.joinTable = "mst_pengelolaan";
    }

    try {
      const {
        data: { data },
      } = await post("/porto/detail", QueryString.stringify(eq));

      data.data.forEach((element, index) => {
        element.key = index;
        element.nominal = Number(element.nominal);
        element.presentase = `${(
          (element.nominal / data.totalNominal) *
          100
        ).toFixed(2)}%`;
      });

      setData(data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: error.message,
      });
      setLoading(false);
    }
  };

  const getIssuer = async () => {
    try {
      const {
        data: { data },
      } = await get("/issuer/select");
      let item = [
        {
          label: "All",
          value: "all",
        },
      ];
      data.rows.forEach((element) => {
        item.push({
          label: element.nama,
          value: element.id,
        });
      });
      setIssuer({ item: item, data: data });
    } catch (error) {
      notification.error({
        message: error.message,
      });
    }
  };

  const onFilter = () => {
    if (filterStartDate.isAfter(filterEndDate)) {
      notification.error({
        message: "Error",
        description: "Period awal tidak boleh lebih besar dari period akhir",
      });
    } else {
      getData();
    }
  };

  const onTabChange = (key) => {
    setTab(key);
  };

  const config = {
    appendPadding: 10,
    data: data?.data ?? [],
    angleField: "nominal",
    colorField: "nama",
    radius: 1,
    innerRadius: 0.4,
    label: {
      type: "inner",
      offset: "-50%",
      content: function content(_ref) {
        return `${_ref.presentase}`;
      },
      style: {
        textAlign: "center",
        fontSize: 14,
      },
      autoRotate: false,
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    // hide statistic
    statistic: false,
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.nama,
          value: datum.nominal.toLocaleString("id-ID"),
        };
      },
    },
  };

  const tabList = [
    {
      key: "tenor",
      tab: "Tenor",
    },
    {
      key: "pengelolaan",
      tab: "Pengelolaan",
    },
    {
      key: "kepemilikan",
      tab: "Kepemilikan",
    },
    {
      key: "kbmi",
      tab: "KBMI",
    },
  ];
  if (subtipe === "sbi" || subtipe === "sbn") {
    // remove kbmi, kepemilikan
    tabList.splice(3, 1);
    tabList.splice(2, 1);
  }

  const columns = [
    {
      title: "Jenis",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "Nominal (Jutaan)",
      dataIndex: "nominal",
      key: "nominal",
      align: "right",
      render: (text) => (text / 1000000).toLocaleString("id-ID"),
    },
    {
      title: "Presentase",
      dataIndex: "presentase",
      key: "presentase",
    },
  ];

  const contentList = tabList.reduce((acc, { key }) => {
    acc[key] = (
      <Table
        bordered
        columns={columns}
        dataSource={data?.data ?? []}
        pagination={{
          hideOnSinglePage: true,
        }}
        style={{
          width: "100%",
        }}
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={1}>Total</Table.Summary.Cell>
                <Table.Summary.Cell colSpan={1}>
                  <div style={{ textAlign: "right" }}>
                    {(data?.totalNominal / 1000000).toLocaleString("id-ID") ??
                      0}
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    );
    return acc;
  }, {});

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        <Button
          type="link"
          className="icon-back"
          icon={<ArrowLeftOutlined />}
          onClick={() => history(-1)}
        />
        Detail {subtipe.toUpperCase()}
      </Typography.Title>
      <Card className="mb-1" style={{ minHeight: "175px" }}>
        <Row gutter={[8, 8]}>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Period</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <DatePicker
              picker="month"
              format={"MM-YYYY"}
              defaultValue={filterStartDate}
              onChange={(date) => setfilterStartDate(date)}
            />{" "}
            -{" "}
            <DatePicker
              picker="month"
              format={"MM-YYYY"}
              defaultValue={filterEndDate}
              onChange={(date) => setfilterEndDate(date)}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Issuer</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={filterIssuer}
              options={issuer.item}
              onChange={(value) => setFilterIssuer(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}></Col>
          <Col span={isMobile ? 24 : 22}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ maxWidth: "300px", width: "100%" }}
              onClick={onFilter}
            >
              Filter
            </Button>
          </Col>
        </Row>
      </Card>
      <Card
        tabList={tabList}
        activeTabKey={tab}
        onTabChange={(key) => {
          getData(key);
          onTabChange(key);
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={isMobile ? 24 : 8}>
            <Pie {...config} />
          </Col>
          <Col
            span={isMobile ? 24 : 16}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {contentList[tab]}
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}
