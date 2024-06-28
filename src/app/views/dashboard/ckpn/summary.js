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
  Radio,
  notification,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";
import { post, get, getFilterDate } from "../../../functions/helper";
import QueryString from "qs";
import * as XLSX from "xlsx";

export function SummaryCKPN() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(
    getFilterDate().startDate
  );
  const [filterEndDate, setfilterEndDate] = React.useState(
    getFilterDate().endDate
  );

  const [type, setType] = React.useState("monthly");
  const [filterBank, setfilterBank] = React.useState("all");
  const [filterCustody, setfilterCustody] = React.useState("all");
  const [pickerDate, setPickerDate] = React.useState("month");

  const [custody, setCustody] = React.useState([]);
  const [totalECL, setTotalECL] = React.useState(0);
  const [dataChart, setDataChart] = React.useState([]);
  const [dataSource, setDataSource] = React.useState([]);
  const [bank, setBank] = React.useState([]);

  React.useEffect(() => {
    getBank();
    getData();
    getBankCustody();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = () => {
    if (filterStartDate.isAfter(filterEndDate)) {
      notification.error({
        message: "Error",
        description: "Periode awal tidak boleh lebih besar dari periode akhir",
        duration: 1,
      });
      return;
    } else {
      getData();
    }
  };

  const isMobile = window.innerWidth <= 768;

  const getData = async () => {
    const eq = {
      type: type,
      startDate: filterStartDate.format("YYYY-MM-DD"),
      endDate: filterEndDate.format("YYYY-MM-DD"),
      rangeDate:
        filterEndDate.diff(filterStartDate, pickerDate) +
        (pickerDate === "month" ? 1 : 2),
      issuer: filterBank,
      custody: filterCustody,
    };
    try {
      setLoading(true);
      let {
        data: { data },
      } = await post("/ckpn/summary", QueryString.stringify(eq));
      if (data.length === 0) {
        notification.warning({
          message: "Warning",
          description: "Data Belum Tersedia",
          duration: 1,
        });
      }
      // add key to data
      // let dataChart = [];
      data.forEach((element, index) => {
        element.key = index;
        element.sum = Number(element.sum / 1000000);
        element.return = element.sum;
        element.bank = element.nama;
      });
      const totalECL = data.reduce(
        (total, element) => total + element.return,
        0
      );

      setTotalECL(totalECL);
      setDataChart(data);
      setDataSource(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

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

  const getBank = async () => {
    const {
      data: { data },
    } = await get("/issuer/select");

    let item = [{ value: "all", label: "All Issuer" }];
    data.rows.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setBank(item);
  };

  const onTypeChange = (e) => {
    if (e === "monthly") {
      setPickerDate("month");
    } else if (e === "yearly") {
      setPickerDate("year");
    }
  };

  const config = {
    data: dataChart,
    xField: "bank",
    yField: "return",
    xAxis: {
      label: {
        autoRotate: true,
        offset: 15,
        style: {
          fontSize: 12,
          fill: "#aaa",
          zIndex: 2,
        },
      },
    },
    meta: {
      bank: { alias: "Bank" },
      return: { alias: "Return" },
    },
    yAxis: {
      label: {
        formatter: (v) => Number(v).toLocaleString("id-ID"),
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.bank,
          value: Number(datum.return).toLocaleString("id-ID"),
        };
      },
    },
    minColumnWidth: "100%",
    maxColumnWidth: "100%",
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
      title: "Bank Custody",
      dataIndex: "custody",
      key: "custody",
      width: 200,
    },
    {
      title: "Issuer",
      dataIndex: "nama",
      key: "nama",
    },
    {
      title: "ECL (Jutaan)",
      dataIndex: "sum",
      key: "sum",
      render: (text) => Number(text).toLocaleString("id-ID"),
    },
  ];

  const onExport = async () => {
    const fileName = `Summary CKPN ${type}.xlsx`;

    const dataExport = dataChart.map((element) => {
      return {
        "Bank Custody": element.custody,
        Issuer: element.bank,
        "ECL (Jutaan)": Number(element.return).toLocaleString("id-ID"),
      };
    });

    dataExport.push({
      "Bank Custody": "Total",
      Issuer: "",
      "ECL (Jutaan)": Number(totalECL).toLocaleString("id-ID"),
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
                  onChange={(value) => setfilterCustody(value)}
                  style={{ marginRight:10, minWidth:200 }}
                />
                {/* <Select
                  defaultValue={filterBank}
                  options={bank}
                  onChange={(value) => setfilterBank(value)}
                  style={{ marginRight:10, minWidth:200 }}
                /> */}
              </Col>
              <Col span={isMobile ? 24 : 2}></Col>
              <Col span={isMobile ? 24 : 22}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ maxWidth: 115, width: "100%" }}
                  onClick={onFilter}
                >
                  Filter
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {dataSource.length !== 0 &&
      <>
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
                  <Table.Summary.Cell colSpan={2}>
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
      </>
      }

    </Spin>
  );
}
