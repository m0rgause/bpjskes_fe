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
  Modal,
  Radio,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";
import { post, get } from "../../../functions/helper";
import * as XLSX from "xlsx";

export function ObligasiCKPN() {
  const [loading, setLoading] = React.useState(false);

  const [type, setType] = React.useState("monthly");
  const [listDate, setListDate] = React.useState([]);
  const [pickerDate, setPickerDate] = React.useState("month");

  const [filterBank, setfilterBank] = React.useState("all");
  const [filterTenor, setfilterTenor] = React.useState("all");
  const [filterCustody, setfilterCustody] = React.useState("all");

  const [totalECL, setTotalECL] = React.useState(0);
  const [custody, setCustody] = React.useState([]);
  const [bank, setBank] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [tenor, setTenor] = React.useState([]);
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
    setListDate([]);

    if (e.target.value === "monthly") {
      setPickerDate("month");
    } else if (e.target.value === "yearly") {
      setPickerDate("year");
    }
  };

  const onFilter = () => {
    // sort date ascending
    let list = [...listDate];
    list.sort((a, b) => {
      return dayjs(a).diff(dayjs(b));
    });
    setListDate(list);
    getData();
  };

  const getData = async () => {
    setLoading(true);
    let eq = {
      type: type,
      list_date: listDate,
      custody: filterCustody,
      issuer: filterBank,
      tenor: filterTenor,
    };

    try {
      const response = await post("/ckpn/obligasi", eq);
      console.log(response);
      const data = response.data.data;

      const dataChart = data.data.map((item) => ({
        tanggal: item.period,
        return: Number(item.sum),
      }));

      const dataSource = data.table.map((item, index) => ({
        key: index,
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
        get("/master/select/tenor?tipe=obligasi"),
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
  const onAddDate = () => {
    Modal.info({
      title: "Add Date",
      content: (
        <div>
          <DatePicker
            picker={pickerDate}
            onChange={(date, dateString) => {
              let list = [...listDate];
              list.push(dateString);
              setListDate(list);
              Modal.destroyAll();
            }}
            style={{ width: "100%", maxWidth: "300px" }}
          />
        </div>
      ),
      // remove ok button
      okButtonProps: { style: { display: "none" } },
      // close modal when click outside
      maskClosable: true,
    });
  };
  const isMobile = window.innerWidth <= 768;

  const onExport = () => {
    const fileName = `Deposito CKPN ${type}.xlsx`;

    const dataExport = data.table.map((item) => {
      return {
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
        Nominal: item.nominal,
        "Term of Interest": item.interest_date,
        "Sisa Tenor": item.sisa_tenor,
        "Rate (%)": item.rate.toFixed(2),
        PD: item.pd.toFixed(2),
        "LGD (%)": item.lgd,
        ECL: item.ecl,
      };
    });

    dataExport.push({
      "Unique ID": "Total",
      "Bank Custody": "",
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
      "LGD (%)": "",
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
    minColumnWidth: isMobile ? 24 : 100,
    maxColumnWidth: isMobile ? 24 : 100,
    color: () => {
      return "#3AA0FF";
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
      title: "Bank Custody",
      dataIndex: "nama_custody",
      key: "nama_custody",
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
      title: "Nominal",
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
      title: "ECL",
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
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Type</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
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
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Period</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              mode="multiple"
              placeholder="Select date"
              style={{ width: "100%", maxWidth: "300px" }}
              value={listDate}
              onChange={(value) => {
                setListDate(value);
              }}
              dropdownRender={() => null}
              // when click on select, open modal
              onClick={() => {
                onAddDate();
              }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Bank Custody</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={filterCustody}
              options={custody}
              onChange={(value) => setfilterCustody(value)}
              style={{ maxWidth: "300px", width: "100%" }}
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
          className="mb-1"
          scroll={{ x: 2000 }}
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={16}>
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
