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
  Radio,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";
import { post, get, getFilterDate } from "../../../functions/helper";
import * as XLSX from "xlsx";

export function ObligasiCKPN() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(
    getFilterDate().startDate
  );
  const [filterEndDate, setfilterEndDate] = React.useState(
    getFilterDate().endDate
  );

  const [type, setType] = React.useState("monthly");
  const [pickerDate, setPickerDate] = React.useState("month");

  const [filterKepemilikan, setFilterKepemilikan] = React.useState("all");
  const [filterPengelolaan, setFilterPengelolaan] = React.useState("all");
  const [filterBank, setfilterBank] = React.useState("all");
  const [filterKBMI, setfilterKBMI] = React.useState("all");
  const [filterTenor, setfilterTenor] = React.useState("all");
  const [filterCustody, setfilterCustody] = React.useState("all");

  const [totalECL, setTotalECL] = React.useState(0);
  const [custody, setCustody] = React.useState([]);
  const [bank, setBank] = React.useState([]);
  const [kbmi, setKBMI] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [tenor, setTenor] = React.useState([]);
  const [kepemilikan, setKepemilikan] = React.useState([]);
  const [pengelolaan, setPengelolaan] = React.useState([]);
  const [dataChart, setDataChart] = React.useState([]);
  const [dataSource, setDataSource] = React.useState([]);

  React.useEffect(() => {
    getFilter();
    getData();
    getBankCustody();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBankCustody = async () => {
    const {
      data: { data },
    } = await get("/custody");

    let item = [{ value: "all", label: "All" }];
    data.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setCustody(item);
  };

  const onTypeChange = (e) => {
    if (e.target.value === "monthly") {
      setPickerDate("month");
    } else if (e.target.value === "yearly") {
      setPickerDate("year");
    }
  };

  const onFilter = () => {
    if (filterStartDate.isAfter(filterEndDate)) {
      notification.error({
        message: "Error",
        description: "Periode awal tidak boleh lebih besar dari periode akhir",
      });
      return;
    }
    getData();
  };

  const getData = async () => {
    setLoading(true);
    let eq = {
      type: type,
      startDate: filterStartDate.format("YYYY-MM-DD"),
      endDate: filterEndDate.format("YYYY-MM-DD"),
      rangeDate:
        filterEndDate.diff(filterStartDate, pickerDate) +
        (pickerDate === "month" ? 1 : 2),
      custody: filterCustody,
      issuer: filterBank,
      tenor: filterTenor,
      kepemilikan: filterKepemilikan,
      pengelolaan: filterPengelolaan,
      kbmi: filterKBMI,
    };

    try {
      const response = await post("/ckpn/obligasi", eq);
      const data = response.data.data;
      const dataChart = data.data.map((item) => ({
        tanggal: item.period,
        return: Number(item.sum / 1000000),
      }));

      const dataSource = data.table.map((item, index) => ({
        key: index,
        tanggal: item.tanggal,
        unique_id: item.unique_id,
        nama_custody: item.nama_custody,
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
        nominal: item.nominal / 1000000,
        sisa_tenor: item.sisa_tenor,
        rate: item.rate,
        pd: item.pd,
        lgd: item.lgd,
        ecl: Number(item.ecl / 1000000),
      }));

      const totalECL = dataSource.reduce((total, item) => total + item.ecl, 0);
      setTotalECL(totalECL);
      setDataChart(dataChart);
      setData(data);
      setDataSource(dataSource);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilter = async () => {
    setLoading(true);
    try {
      const [
        issuerResponse,
        tenorResponse,
        pengelolaanResponse,
        kepemilikanResponse,
        kbmiResponse,
      ] = await Promise.all([
        get("/issuer/select?tipe=obligasi"),
        get("/master/select/tenor?tipe=obligasi"),
        get("/master/select/kepemilikan"),
        get("/master/select/pengelolaan"),
        get("/master/select/kbmi"),
      ]);

      const issuerData = issuerResponse.data.data;
      const tenorData = tenorResponse.data.data;
      const kepemilikanData = kepemilikanResponse.data.data;
      const pengelolaanData = pengelolaanResponse.data.data;
      const kbmiData = kbmiResponse.data.data;

      const bank = [{ value: "all", label: "All" }];
      const tenorList = [{ value: "all", label: "All" }];
      const kepemilikan = [{ value: "all", label: "All" }];
      const pengelolaan = [{ value: "all", label: "All" }];
      const kbmi = [{ value: "all", label: "All" }];

      issuerData.rows.forEach((item) => {
        bank.push({ value: item.id, label: item.nama });
      });

      tenorData.rows.forEach((item) => {
        tenorList.push({ value: item.id, label: item.nama });
      });

      kepemilikanData.rows.forEach((item) => {
        kepemilikan.push({ value: item.id, label: item.nama });
      });

      pengelolaanData.rows.forEach((item) => {
        pengelolaan.push({ value: item.id, label: item.nama });
      });

      kbmiData.rows.forEach((item) => {
        kbmi.push({ value: item.id, label: item.nama });
      });

      setBank(bank);
      setTenor(tenorList);
      setKepemilikan(kepemilikan);
      setPengelolaan(pengelolaan);
      setKBMI(kbmi);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const isMobile = window.innerWidth <= 768;

  const onExport = () => {
    const fileName = `Deposito CKPN ${type}.xlsx`;

    const dataExport = data.table.map((item) => {
      return {
        Period: item.tanggal,
        "Unique ID": item.unique_id,
        "Bank Custody": item.nama_custody,
        Issuer: item.nama_issuer,
        KBMI: item.nama_kbmi,
        Tenor: item.nama_tenor,
        Pengelolaan: item.nama_pengelolaan,
        Kepemilikan: item.nama_kepemilikan,
        "No. Security": item.no_security,
        "Issued Date": item.start_date,
        "Maturity Date": item.end_date,
        "Nominal (Jutaan)": item.nominal / 1000000,
        "Term of Interest": item.interest_date,
        "Sisa Tenor": item.sisa_tenor,
        "Rate (%)": item.rate.toFixed(2),
        PD: item.pd.toFixed(2),
        "LGD (%)": item.lgd,
        "ECL (Jutaan)": item.ecl / 1000000,
      };
    });

    dataExport.push({
      Period: "Total",
      "Unique ID": "",
      "Bank Custody": "",
      Issuer: "",
      KBMI: "",
      Tenor: "",
      Pengelolaan: "",
      Kepemilikan: "",
      "No. Security": "",
      "Issued Date": "",
      "Maturity Date": "",
      "Nominal (Jutaan)": "",
      "Term of Interest": "",
      "Sisa Tenor": "",
      "Rate (%)": "",
      PD: "",
      "LGD (%)": "",
      "ECL (Jutaan)": totalECL,
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
        autoRotate: true,
        offset: 10,
        style: {
          fontSize: 12,
          fill: '#aaa',
        }
      }
    },
    label: {
      position: "middle",
      formatter: (datum) => {
        return Number(datum.return).toLocaleString("id-ID");
      },
    },
    yAxis: {
      label: {
        formatter: (v) => {
          return Number(v).toLocaleString("id-ID");
        },
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.tanggal,
          value: Number(datum.return).toLocaleString("id-ID"),
        };
      },
    },
    meta: {
      tanggal: { alias: "Tanggal" },
      return: { alias: "Return" },
    },
    minColumnWidth: '100%',
    maxColumnWidth: '100%',
    color: () => {
      return "#3AA0FF";
    },
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
  };

  const columns = [
    {
      title: "Period",
      dataIndex: "tanggal",
      key: "tanggal",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
    },
    {
      title: "Unique ID",
      dataIndex: "unique_id",
      key: "unique_id",
    },
    {
      title: "Bank Custody",
      dataIndex: "nama_custody",
      key: "nama_custody",
      width: 200,
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
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
    },
    {
      title: "Maturity Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
    },
    {
      title: "Nominal (Jutaan)",
      dataIndex: "nominal",
      key: "nominal",
      render: (text) => Number(text).toLocaleString("id-ID"),
    },
    {
      title: "Term of Interest",
      dataIndex: "interest_date",
      key: "interest_date",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
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
      render: (text) => {
        // bulatkan ke 2 angka dibelakang koma
        return Number(text).toFixed(2);
      },
    },
    {
      title: "PD",
      dataIndex: "pd",
      key: "pd",
      render: (text) => {
        // bulatkan ke 2 angka dibelakang koma
        return Number(text).toFixed(2);
      },
    },
    {
      title: "LGD (%)",
      dataIndex: "lgd",
      key: "lgd",
    },
    {
      title: "ECL (Jutaan)",
      dataIndex: "ecl",
      key: "ecl",
      render: (text) => Number(text).toLocaleString("id-ID"),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Obligasi
      </Typography.Title>
      <Card className="mb-1" style={{ minHeight: "175px" }}>
        <Row gutter={[8, 8]}>
          <Col span={isMobile ? 24 : 3}>
            <Typography.Text strong>Type</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 21}>
            <Radio.Group
              defaultValue={type}
              onChange={(e) => {
                setType(e.target.value);
                onTypeChange(e);
              }}
            >
              <Radio value="monthly">Monthly</Radio>
              <Radio value="yearly">Yearly</Radio>
            </Radio.Group>
          </Col>
          <Col span={isMobile ? 24 : 3}>
            <Typography.Text strong>Period</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 21}>
            <div>
              <DatePicker
                defaultValue={filterStartDate}
                picker={pickerDate}
                onChange={(date) => setfilterStartDate(date)}
                style={{
                  marginRight: "5px",
                  maxWidth: "150px",
                  width: "100%",
                  marginBottom: isMobile ? "5px" : "0",
                }}
              />
              {isMobile ? "" : "-"}
              <DatePicker
                defaultValue={filterEndDate}
                picker={pickerDate}
                onChange={(date) => setfilterEndDate(date)}
                style={{
                  marginLeft: isMobile ? "0" : "5px",
                  maxWidth: "150px",
                  width: "100%",
                }}
              />
            </div>
          </Col>
          <Col span={isMobile ? 24 : 3}>
            <Typography.Text strong>Bank Custody</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 21}>
            <Select
              defaultValue={filterCustody}
              options={custody}
              onChange={(value) => setfilterCustody(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          {/*<Col span={isMobile ? 24 : 3}>
            <Typography.Text strong>KBMI</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 21}>
            <Select
              defaultValue={filterKBMI}
              options={kbmi}
              onChange={(value) => setfilterKBMI(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>*/}
          <Col span={isMobile ? 24 : 3}>
            <Typography.Text strong>Issuer</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 21}>
            <Select
              defaultValue={filterBank}
              options={bank}
              onChange={(value) => setfilterBank(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 3}>
            <Typography.Text strong>Tenor</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 21}>
            <Select
              defaultValue={filterTenor}
              options={tenor}
              onChange={(value) => setfilterTenor(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 3}>
            <Typography.Text strong>Kepemilikan</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 21}>
            <Select
              defaultValue={filterKepemilikan}
              options={kepemilikan}
              onChange={(value) => setFilterKepemilikan(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 3}>
            <Typography.Text strong>Pengelolaan</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 21}>
            <Select
              defaultValue={filterPengelolaan}
              options={pengelolaan}
              onChange={(value) => setFilterPengelolaan(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 3}></Col>
          <Col span={isMobile ? 24 : 21}>
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
      <Card className="mb-1">
        <Column {...config} />
      </Card>
      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            showSizeChanger: false,
            hideOnSinglePage: true,
          }}
          bordered
          className="mb-1 text-nowrap"
          scroll={{ x: 2000 }}
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={17}>
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
