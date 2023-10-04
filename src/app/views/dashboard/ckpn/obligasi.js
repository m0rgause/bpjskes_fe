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

export function ObligasiCKPN() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs().add(6, "M"));
  const [filterBank, setfilterBank] = React.useState("all");
  const [filterTenor, setfilterTenor] = React.useState("all");

  const [totalECL, setTotalECL] = React.useState(0);
  const [bank, setBank] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [tenor, setTenor] = React.useState([]);
  const [dataChart, setDataChart] = React.useState([]);
  const [dataSource, setDataSource] = React.useState([]);

  React.useEffect(() => {
    getFilter();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    let eq = {
      start: filterStartDate.format("YYYY-MM-DD"),
      end: filterEndDate.format("YYYY-MM-DD"),
      range: filterStartDate.diff(filterEndDate, "month"),
      issuer: filterBank,
      tenor: filterTenor,
    };

    try {
      const response = await post("/ckpn/obligasi", QueryString.stringify(eq));
      const data = response.data.data;

      const dataChart = data.data.map((item) => ({
        tanggal: item.period,
        return: Number(item.sum),
      }));

      const dataSource = data.table.map((item, index) => ({
        key: index,
        unique_id: item.unique_id,
        nama_issuer: item.nama_issuer,
        nama_kbmi: item.nama_kbmi,
        nama_kepemilikan: item.nama_kepemilikan,
        nama_pengelolaan: item.nama_pengelolaan,
        nama_tenor: item.nama_tenor,
        tipe: item.tipe,
        no_security: item.no_security,
        start_date: item.start_date,
        end_date: item.end_date,
        interest_date: item.interest_date,
        nominal: item.nominal,
        sisa_tenor: item.sisa_tenor,
        rate: item.rate,
        pd: item.pd,
        lgd: item.lgd,
        ecl: Number(item.ecl),
      }));

      const totalECL = dataSource.reduce((total, item) => total + item.ecl, 0);
      setTotalECL(totalECL);
      setDataChart(dataChart);
      setData(data);
      setDataSource(dataSource);
    } catch (error) {
      // Handle error appropriately
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilter = async () => {
    setLoading(true);
    try {
      const [issuerResponse, tenorResponse] = await Promise.all([
        get("/issuer/select"),
        get("/master/select/tenor"),
      ]);

      const issuerData = issuerResponse.data.data;
      const tenorData = tenorResponse.data.data;

      const bank = [{ value: "all", label: "All" }];
      const tenorList = [{ value: "all", label: "All" }];

      issuerData.rows.forEach((item) => {
        bank.push({ value: item.id, label: item.nama });
      });

      tenorData.rows.forEach((item) => {
        tenorList.push({ value: item.id, label: item.nama });
      });

      setBank(bank);
      setTenor(tenorList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFilter = () => {
    if (filterStartDate.isAfter(filterEndDate)) {
      notification.error({
        message: "Error",
        description: "Period awal tidak boleh lebih besar dari period akhir",
      });
      return;
    }
    getData();
  };
  const isMobile = window.innerWidth <= 768;

  const onExport = () => {
    const fileName = `Deposito CKPN ${filterStartDate.format(
      "YYYY-MM-DD"
    )} - ${filterEndDate.format("YYYY-MM-DD")}.xlsx`;

    const dataExport = data.table.map((item) => {
      return {
        "Unique ID": item.unique_id,
        Issuer: item.nama_issuer,
        KBMI: item.nama_kbmi,
        Tenor: item.nama_tenor,
        Pengelolaan: item.nama_pengelolaan,
        Kepemilikan: item.nama_kepemilikan,
        "No. Security": item.no_security,
        "Issued Date": item.start_date,
        "Maturity Date": item.end_date,
        Nominal: item.nominal,
        "Term of Interest": item.interest_date,
        "Sisa Tenor": item.sisa_tenor,
        "Rate (%)": item.rate,
        PD: item.pd,
        LGD: item.lgd,
        ECL: item.ecl,
      };
    });

    dataExport.push({
      "Unique ID": "Total",
      Issuer: "",
      KBMI: "",
      Tenor: "",
      Pengelolaan: "",
      Kepemilikan: "",
      "No. Security": "",
      "Issued Date": "",
      "Maturity Date": "",
      Nominal: "",
      "Term of Interest": "",
      "Sisa Tenor": "",
      "Rate (%)": "",
      PD: "",
      LGD: "",
      ECL: totalECL,
    });

    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    XLSX.writeFile(wb, fileName);
  };

  const config = {
    data: dataChart,
    xField: "tanggal",
    yField: "return",
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      tanggal: { alias: "Tanggal" },
      return: { alias: "Return" },
    },
    minColumnWidth: isMobile ? 24 : 100,
    maxColumnWidth: isMobile ? 24 : 100,
    color: () => {
      return "#FAD337";
    },
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
  };

  const columns = [
    {
      title: "Unique ID",
      dataIndex: "unique_id",
      key: "unique_id",
    },
    {
      title: "Issuer",
      dataIndex: "nama_issuer",
      key: "nama_issuer",
    },
    {
      title: "KBMI",
      dataIndex: "nama_kbmi",
      key: "nama_kbmi",
    },
    {
      title: "Tenor",
      dataIndex: "nama_tenor",
      key: "nama_tenor",
    },
    {
      title: "Pengelolaan",
      dataIndex: "nama_pengelolaan",
      key: "nama_pengelolaan",
    },
    {
      title: "Kepemilikan",
      dataIndex: "nama_kepemilikan",
      key: "nama_kepemilikan",
    },
    {
      title: "No. Security",
      dataIndex: "no_security",
      key: "no_security",
    },
    {
      title: "Issued Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Maturity Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      render: (text) => Number(text).toLocaleString("id-ID"),
    },
    {
      title: "Term of Interest",
      dataIndex: "interest_date",
      key: "interest_date",
    },
    {
      title: "Sisa Tenor",
      dataIndex: "sisa_tenor",
      key: "sisa_tenor",
    },
    {
      title: "Rate (%)",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "PD",
      dataIndex: "pd",
      key: "pd",
    },
    {
      title: "LGD",
      dataIndex: "lgd",
      key: "lgd",
    },
    {
      title: "ECL",
      dataIndex: "ecl",
      key: "ecl",
      render: (text) => Number(text).toLocaleString("id-ID"),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Deposito
      </Typography.Title>
      <Card className="mb-1" style={{ minHeight: "175px" }}>
        <Row gutter={[8, 8]}>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Period</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <DatePicker
              defaultValue={filterStartDate}
              format={"MM-YYYY"}
              picker="month"
              onChange={(date) => setfilterStartDate(date)}
            />{" "}
            -{" "}
            <DatePicker
              defaultValue={filterEndDate}
              format={"MM-YYYY"}
              picker="month"
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
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Tenor</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={filterTenor}
              options={tenor}
              onChange={(value) => setfilterTenor(value)}
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
        ``
      </Card>
      <Card className="mb-1">
        <Column {...config} />
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          className="mb-1"
          scroll={{ x: 2000 }}
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={15}>
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
