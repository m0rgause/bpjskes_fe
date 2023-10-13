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
  notification,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";
import { post, get } from "../../../functions/helper";
import QueryString from "qs";
import * as XLSX from "xlsx";

export function SummaryCKPN() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(
    dayjs().startOf("month")
  );
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs().add(6, "M"));
  const [filterBank, setfilterBank] = React.useState("all");
  const [totalECL, setTotalECL] = React.useState(0);
  const [dataChart, setDataChart] = React.useState([]);
  const [dataSource, setDataSource] = React.useState([]);

  const [bank, setBank] = React.useState([]);

  React.useEffect(() => {
    getBank();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const isMobile = window.innerWidth <= 768;

  const getData = async () => {
    const eq = {
      start: filterStartDate.format("YYYY-MM-DD"),
      end: filterEndDate.format("YYYY-MM-DD"),
      range: filterStartDate.diff(filterEndDate, "month"),
      issuer: filterBank,
    };
    try {
      setLoading(true);
      let {
        data: { data },
      } = await post("/ckpn/summary", QueryString.stringify(eq));

      // add key to data
      let dataChart = [];
      data.forEach((element, index) => {
        element.key = index;
        dataChart.push({
          key: index,
          bank: element.nama,
          return: Number(element.sum),
          warna: element.warna,
        });
      });
      const totalECL = dataChart.reduce(
        (total, element) => total + element.return,
        0
      );

      setTotalECL(totalECL);
      setDataChart(dataChart);
      setDataSource(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  const getBank = async () => {
    const {
      data: { data },
    } = await get("/issuer/select");

    let item = [{ value: "all", label: "All" }];
    data.rows.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setBank(item);
  };

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
      let color = "#4ECB73";
      dataChart.forEach((element) => {
        if (element.bank === bank) {
          color = element.warna;
        }
      });
      return color;
    },
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
  };

  const columns = [
    {
      title: "Issuer",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "ECL",
      dataIndex: "sum",
      key: "sum",
      render: (text) => Number(text).toLocaleString("id-ID"),
    },
  ];

  const onExport = async () => {
    const fileName = `Summary CKPN ${filterStartDate.format(
      "MM-YYYY"
    )} - ${filterEndDate.format("MM-YYYY")}.xlsx`;

    const dataExport = dataChart.map((element) => {
      return {
        Bank: element.bank,
        ECL: Number(element.return).toLocaleString("id-ID"),
      };
    });

    dataExport.push({
      Bank: "Total",
      ECL: Number(totalECL).toLocaleString("id-ID"),
    });

    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary CKPN");
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Summary
      </Typography.Title>
      <Row gutter={[8, 8]}>
        <Col span={24}>
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
                  defaultValue={filterBank}
                  options={bank}
                  onChange={(value) => setfilterBank(value)}
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
      </Row>

      <Card className="mb-1">
        <Column {...config} />
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          className="mb-1"
          bordered
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={1}>
                    <strong>Total</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={1}>
                    <strong>{totalECL.toLocaleString("id-ID")}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
        <Button
          type="primary"
          style={{
            backgroundColor: "#4ECB73",
          }}
          icon={<DownloadOutlined />}
          onClick={onExport}
        >
          Export Excel
        </Button>
      </Card>
    </Spin>
  );
}
