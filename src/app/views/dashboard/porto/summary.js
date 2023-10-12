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
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { get, post } from "../../../functions/helper";
import QueryString from "qs";

export function SummaryPorto() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs().add(6, "M"));
  const [filterIssuer, setFilterIssuer] = React.useState("all");
  const [issuer, setIssuer] = React.useState({ item: [], data: [] }); // for filter
  const [data, setData] = React.useState([]); // for table
  const isMobile = window.innerWidth <= 768;
  const history = useNavigate();

  React.useEffect(() => {
    getIssuer();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    const body = {
      start: filterStartDate.format("YYYY-MM"),
      end: filterEndDate.format("YYYY-MM"),
      range: filterEndDate.diff(filterStartDate, "M") + 1,
      issuer: filterIssuer,
    };

    try {
      const {
        data: { data },
      } = await post("/porto/summary", QueryString.stringify(body));

      data.data.forEach((element, index) => {
        element.key = index;
        element.nominal = Number(element.sum);
        element.presentase = `${(
          (element.sum / data.totalNominal) *
          100
        ).toFixed(2)}%`;
      });

      setData(data);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message,
      });
      setLoading(false);
    }
  };

  const getIssuer = async () => {
    const {
      data: { data },
    } = await get("/issuer/select");

    let item = [{ value: "all", label: "All" }];
    data?.rows.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setIssuer({
      item: item,
      data: data.rows,
    });
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
  const config = {
    appendPadding: 10,
    data: data?.data ?? [],
    angleField: "nominal",
    colorField: "tipe",
    radius: 1,
    innerRadius: 0.6,
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
    // hover label format
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.tipe,
          value: datum.nominal.toLocaleString("id-ID"),
        };
      },
    },
  };

  const columns = [
    {
      title: "Jenis",
      dataIndex: "tipe",
      key: "tipe",
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
    {
      title: "Presentase",
      dataIndex: "presentase",
      key: "presentase",
    },
    {
      title: "Aksi",
      dataIndex: "aksi",
      key: "aksi",
      render: (text, record) => {
        let push;
        if (record.tipe) {
          push = `/porto/detail/${record.tipe.toLowerCase()}/?subtipe=${
            record.tipe
          }`;
        }
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              history(push);
            }}
          >
            Detail
          </Button>
        );
      },
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Summary
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
      <Card>
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
            <Table
              bordered
              columns={columns}
              dataSource={data?.data}
              pagination={{
                hideOnSinglePage: true,
              }}
              style={{
                width: isMobile ? "100%" : "100%",
              }}
              summary={() => {
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={1}>
                      Total
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={1} align="right">
                      {data?.totalNominal?.toLocaleString("id-ID") ?? 0}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell
                      index={2}
                      colSpan={2}
                    ></Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}
