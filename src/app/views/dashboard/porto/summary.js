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
import { get, post, getFilterDate } from "../../../functions/helper";
import QueryString from "qs";

export function SummaryPorto() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(getFilterDate().startDate);
  const [filterEndDate, setfilterEndDate] = React.useState(getFilterDate().endDate);
  const [filterIssuer, setFilterIssuer] = React.useState("all");
  const [filterCustody, setFilterCustody] = React.useState("all");
  const [issuer, setIssuer] = React.useState({ item: [], data: [] }); // for filter
  const [type, setType] = React.useState("monthly");
  const [pickerDate, setPickerDate] = React.useState("month");

  const [data, setData] = React.useState([]); // for table
  const [custody, setCustody] = React.useState([]); // for table
  const isMobile = window.innerWidth <= 768;
  const history = useNavigate();

  React.useEffect(() => {
    getIssuer();
    getData();
    getBankCustody();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBankCustody = async () => {
    const {
      data: { data },
    } = await get("/custody");

    let item = [{ value: "all", label: "All Custody" }];
    data.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setCustody(item);
  };
  const getData = async () => {
    setLoading(true);
    const body = {
      type: type,
      start: filterStartDate.format("YYYY-MM"),
      end: filterEndDate.format("YYYY-MM"),
      range:
        filterEndDate.diff(filterStartDate, pickerDate) +
        (pickerDate === "month" ? 1 : 2),
      issuer: filterIssuer,
      custody: filterCustody,
    };

    try {
      const {
        data: { data },
      } = await post("/porto/summary", QueryString.stringify(body));

      if(data.data.length === 0) {
        notification.warning({
          message: "Warning",
          description: "Data Belum Tersedia",
          duration: 1,
        });
      }

      data.data.forEach((element, index) => {
        element.key = index;
        element.nominal = Number(element.sum / 1000000);
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
        duration: 1,
      });
      setLoading(false);
    }
  };

  const getIssuer = async () => {
    const {
      data: { data },
    } = await get("/issuer/select");

    let item = [{ value: "all", label: "All Issuer" }];
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
        duration: 1,
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
    innerRadius: 0.4,
    label: {
      autoRotate: false,
      // type: "inner",
      position: "outside",
      content: function content(_ref) {
        return `${_ref.presentase}`;
      },
      style: {
        // fill: "#fff",
        // if percentage is lower than 10%, hide label
        opacity: (datum) => {
          return datum.presentase < 10 ? 0 : 1;
        },
        // textAlign: "center",
        // fontSize: 14,
      },
      // offset: "-50%",
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
          name: datum.tipe?.toUpperCase() ?? datum.tipe,
          value: datum.nominal?.toLocaleString("id-ID"),
        };
      },
    },
  };

  const onTypeChange = (e) => {
    if (e === "monthly") {
      setPickerDate("month");
    } else if (e === "yearly") {
      setPickerDate("year");
    }
  };

  const columns = [
    {
      title: "Jenis",
      dataIndex: "tipe",
      key: "tipe",
      render: (text) => text?.toUpperCase() ?? text,
    },
    {
      title: "Nominal (Jutaan)",
      dataIndex: "nominal",
      key: "nominal",
      align: "right",
      render: (text) => {
        return text.toLocaleString("id-ID");
      },
    },
    {
      title: "Presentase",
      dataIndex: "presentase",
      key: "presentase",
    },
    {
      title: "Action",
      dataIndex: "aksi",
      key: "aksi",
      render: (text, record) => {
        let push;
        if (record.tipe) {
          push = `/porto/detail/${record.tipe.toLowerCase()}/?subtipe=${record.tipe
            }&type=${type}&start=${filterStartDate.format(
              "YYYY-MM"
            )}&end=${filterEndDate.format(
              "YYYY-MM"
            )}&picker=${pickerDate}&issuer=${filterIssuer}&custody=${filterCustody}`;
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
      <Card className="mb-1">
        <Row gutter={[8, 8]}>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Period</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={type}
              options={[{key:0, value:'monthly', label:'Monthly'}, {key:1, value:'yearly', label:'Yearly'}]}
              onChange={(e) => {
                setType(e);
                onTypeChange(e);
              }}
              style={{ marginRight:10 }}
            />
            <DatePicker
              defaultValue={filterStartDate}
              picker={pickerDate}
              onChange={(date) => setfilterStartDate(date)}
              style={{
                marginRight: "5px",
                marginBottom: isMobile ? "5px" : "0",
              }}
            />
            <DatePicker
              defaultValue={filterEndDate}
              picker={pickerDate}
              onChange={(date) => setfilterEndDate(date)}
              style={{
                marginLeft: isMobile ? "0" : "5px",
              }}
            />

          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Reference</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={filterCustody}
              options={custody}
              onChange={(value) => setFilterCustody(value)}
              style={{ marginRight:10, minWidth:200 }}
            />
            <Select
              defaultValue={filterIssuer}
              options={issuer.item}
              onChange={(value) => setFilterIssuer(value)}
              style={{ minWidth:200 }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ maxWidth: "115px", width: "100%" }}
              onClick={onFilter}
            >
              Filter
            </Button>
          </Col>
        </Row>
      </Card>

      {data?.totalNominal !== 0 &&
      <>
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
                      {(data?.totalNominal / 1000000).toLocaleString("id-ID")}
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
      </>
      }

    </Spin>
  );
}
