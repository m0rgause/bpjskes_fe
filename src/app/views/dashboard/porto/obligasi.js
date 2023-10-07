import React from "react";
import {
  Spin,
  Typography,
  Row,
  Col,
  DatePicker,
  Button,
  Select,
  Card,
  Table,
  notification,
} from "antd";
import dayjs from "dayjs";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import { get, post } from "../../../functions/helper";
import QueryString from "qs";
import * as XLSX from "xlsx";

export function ObligasiPorto() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs().add(6, "M"));
  const [filterIssuer, setFilterIssuer] = React.useState("all");
  const [filterKBMI, setFilterKBMI] = React.useState("all");
  const [filterTenor, setFilterTenor] = React.useState("all");
  const [filterKepemilikan, setFilterKepemilikan] = React.useState("all");
  const [filterPengelolaan, setFilterPengelolaan] = React.useState("all");

  const [issuer, setIssuer] = React.useState([]); // for filter
  const [kbmi, setKBMI] = React.useState([]); // for filter
  const [tenor, setTenor] = React.useState([]); // for filter
  const [kepemilikan, setKepemilikan] = React.useState([]); // for filter
  const [pengelolaan, setPengelolaan] = React.useState([]); // for filter

  const [data, setData] = React.useState([]); // for table
  const [dataChart, setDataChart] = React.useState([]); // for chart

  React.useEffect(() => {
    getFilter();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = () => {
    if (filterStartDate.isAfter(filterEndDate)) {
      notification.error({
        message: "Error",
        description: "Start date must be before end date",
      });
      return;
    }
    getData();
  };

  const getData = async () => {
    const eq = QueryString.stringify({
      start: filterStartDate.format("YYYY-MM"),
      end: filterEndDate.format("YYYY-MM"),
      range: filterEndDate.diff(filterStartDate, "month") + 1,
      issuer: filterIssuer,
      kbmi: filterKBMI,
      tenor: filterTenor,
      kepemilikan: filterKepemilikan,
      pengelolaan: filterPengelolaan,
      subtipe: "obligasi",
    });

    try {
      const {
        data: { data },
      } = await post("/porto/multi", eq);
      data.data.forEach((item) => {
        item.nominal = Number(item.nominal);
      });
      setDataChart(data.data);
      setData(data.dataTable);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (endpoint) => {
    const response = await get(endpoint);
    return response.data.data.rows;
  };

  const createList = (data) => {
    const list = [{ value: "all", label: "All" }];
    data?.forEach((item) => {
      list.push({ value: item.id, label: item.nama });
    });
    return list;
  };

  const getFilter = async () => {
    setLoading(true);
    try {
      const [
        issuerData,
        kbmiData,
        tenorData,
        kepemilikanData,
        pengelolaanData,
      ] = await Promise.all([
        fetchData("/issuer/select"),
        fetchData("/master/select/kbmi"),
        fetchData("/master/select/tenor"),
        fetchData("/master/select/kepemilikan"),
        fetchData("/master/select/pengelolaan"),
      ]);

      const issuerList = createList(issuerData);
      const kbmiList = createList(kbmiData);
      const tenorList = createList(tenorData);
      const kepemilikanList = createList(kepemilikanData);
      const pengelolaanList = createList(pengelolaanData);

      setIssuer(issuerList);
      setKBMI(kbmiList);
      setTenor(tenorList);
      setKepemilikan(kepemilikanList);
      setPengelolaan(pengelolaanList);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isMobile = window.innerWidth <= 768;

  const config = {
    data: dataChart,
    xField: "period",
    yField: "nominal",
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
    // format y axis
    yAxis: {
      label: {
        formatter: (v) => `${Number(v).toLocaleString("id-ID")}`,
      },
    },
    xAxis: {
      label: {
        formatter: (v) => `${dayjs(v).format("MMM YY")}`,
      },
    },
    label: {
      formatter: (v) => ``,
    },
  };
  // column
  // Unique ID, Issuer, KBMI, Tenor, Pengelolaan, Kepemilikan, No Security, Issued Date (start_date), Maturity Date (end_date), Nominal, Term of Interest (interest date), Sisa Tenor, Rate (%)

  const column = [
    {
      title: "Unique ID",
      dataIndex: "unique_id",
      key: "unique_id",
    },
    {
      title: "Issuer",
      dataIndex: "issuer",
      key: "issuer",
    },
    {
      title: "KBMI",
      dataIndex: "kbmi",
      key: "kbmi",
    },
    {
      title: "Tenor",
      dataIndex: "tenor",
      key: "tenor",
    },
    {
      title: "Pengelolaan",
      dataIndex: "pengelolaan",
      key: "pengelolaan",
    },
    {
      title: "Kepemilikan",
      dataIndex: "kepemilikan",
      key: "kepemilikan",
    },
    {
      title: "No Security",
      dataIndex: "no_security",
      key: "no_security",
    },
    {
      title: "Issued Date ",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Maturity Date ",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      align: "right",
      render: (value) => {
        return Number(value).toLocaleString("id-ID");
      },
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
  ];

  const onExport = () => {
    const newData = data.map((item) => {
      return {
        "Unique ID": item.unique_id,
        Issuer: item.issuer,
        KBMI: item.kbmi,
        Tenor: item.tenor,
        Pengelolaan: item.pengelolaan,
        Kepemilikan: item.kepemilikan,
        "No Security": item.no_security,
        "Issued Date": item.start_date,
        "Maturity Date": item.end_date,
        Nominal: item.nominal,
        "Term of Interest": item.interest_date,
        "Sisa Tenor": item.sisa_tenor,
        "Rate (%)": item.rate,
      };
    });
    newData.push({
      "Unique ID": "",
      Issuer: "",
      KBMI: "",
      Tenor: "",
      Pengelolaan: "",
      Kepemilikan: "",
      "No Security": "",
      "Issued Date": "",
      "Maturity Date": "",
      Nominal: data.reduce((a, b) => a + Number(b.nominal), 0),
      "Term of Interest": "",
      "Sisa Tenor": "",
      "Rate (%)": "",
    });

    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

    XLSX.writeFile(wb, "obligasi.xlsx");
  };

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Obligasi
      </Typography.Title>

      <Card className="mb-1">
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
            <Typography.Text strong>KBMI</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={filterKBMI}
              options={kbmi}
              onChange={(value) => setFilterKBMI(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Issuer</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={filterIssuer}
              options={issuer}
              onChange={(value) => setFilterIssuer(value)}
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
              onChange={(value) => setFilterTenor(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Kepemilikan</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={filterKepemilikan}
              options={kepemilikan}
              onChange={(value) => setFilterKepemilikan(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Pengelolaan</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={filterPengelolaan}
              options={pengelolaan}
              onChange={(value) => setFilterPengelolaan(value)}
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

      <Card className="mb-1">
        <Table
          dataSource={data}
          columns={column}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          scroll={{ x: 2000 }}
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={9}>Total</Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    {data
                      ?.reduce((a, b) => a + Number(b.nominal), 0)
                      .toLocaleString("id-ID")}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell colSpan={3}></Table.Summary.Cell>
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
