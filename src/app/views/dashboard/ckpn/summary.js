import React from "react";
import {
  Card,
  Table,
  Spin,
  Typography,
  Row,
  Col,
  DatePicker,
  Button,
  Select,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";
import { post, get } from "../../../functions/helper";
import QueryString from "qs";

export function SummaryCKPN() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(
    dayjs().subtract(6, "month")
  );
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());
  const [filterBank, setfilterBank] = React.useState("all");

  const [bank, setBank] = React.useState([]);

  React.useEffect(() => {
    getBank();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = () => {
    setLoading(true);
  };

  const isMobile = window.innerWidth <= 768;

  const getData = async () => {
    let eq = {
      start: filterStartDate.format("YYYY-MM-DD"),
      end: filterEndDate.format("YYYY-MM-DD"),
      range: filterStartDate.diff(filterEndDate, "month"),
      issuer: filterBank,
    };

    const { data: data } = await post(
      "/ckpn/summary",
      QueryString.stringify(eq)
    );

    console.log(data);
  };

  const getBank = async () => {
    const { data: data } = await get("/issuer/select");

    let item = [{ value: "all", label: "All" }];
    data.data.rows.forEach((element) => {
      item.push({ value: element.id, label: element.nama });
    });
    setBank(item);
  };

  const dataChart = [
    { bank: "Mandiri", return: 3000 },
    { bank: "BCA", return: 20000 },
    { bank: "BNI", return: 30000 },
    { bank: "BRI", return: 10000 },
    { bank: "BTN", return: 5000 },
  ];

  const config = {
    data: dataChart,
    xField: "bank",
    yField: "return",
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      bank: { alias: "Bank" },
      return: { alias: "Return" },
    },
    minColumnWidth: isMobile ? 24 : 100,
    maxColumnWidth: isMobile ? 24 : 100,
    color: ({ bank }) => {
      if (bank === "Mandiri") {
        return "#4ECB73";
      } else if (bank === "BCA") {
        return "#3AA0FF";
      } else if (bank === "BNI") {
        return "#5A6ACF";
      } else if (bank === "BRI") {
        return "#8C8C8C";
      } else if (bank === "BTN") {
        return "#A6ABC9";
      }
    },
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
  };

  const columns = [
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
    },
    {
      title: "ECL",
      dataIndex: "ecl",
      key: "ecl",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
  ];

  const dataSource = [
    {
      key: "1",
      bank: "Mandiri",
      ecl: 929723,
    },
    {
      key: "2",
      bank: "BCA",
      ecl: 929723,
    },
    {
      key: "3",
      bank: "BNI",
      ecl: 929723,
    },
    {
      key: "4",
      bank: "BRI",
      ecl: "929723",
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Summary
      </Typography.Title>
      <Row gutter={[8, 8]}>
        <Col span={isMobile ? 24 : 18}>
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
                <Typography.Text strong>Bank</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <Select
                  defaultValue={filterBank}
                  options={bank}
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
        </Col>
        <Col span={isMobile ? 24 : 6}>
          <Card style={{ minHeight: "175px" }}>
            <Typography.Title level={5} className="page-header">
              Total ECL
            </Typography.Title>
            <Typography.Title level={3} className="page-header">
              0.5%
            </Typography.Title>
          </Card>
        </Col>
      </Row>

      <Card className="mb-1">
        <Column {...config} />
      </Card>

      <Card>
        <Table columns={columns} dataSource={dataSource} className="mb-1" />
        <Button
          type="primary"
          style={{
            backgroundColor: "#4ECB73",
          }}
          icon={<DownloadOutlined />}
        >
          Export Excel
        </Button>
      </Card>
    </Spin>
  );
}
