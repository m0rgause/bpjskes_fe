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
  Radio,
  notification,
} from "antd";
import dayjs from "dayjs";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import { get, post } from "../../../functions/helper";
import QueryString from "qs";
import * as XLSX from "xlsx";

export function SBIPorto() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs().add(6, "M"));
  const [filterCustody, setFilterCustody] = React.useState("all"); // [all, bni, mandiri, bc
  const [filterIssuer, setFilterIssuer] = React.useState("all");
  const [filterTenor, setFilterTenor] = React.useState("all");
  const [filterPengelolaan, setFilterPengelolaan] = React.useState("all");

  const [custody, setCustody] = React.useState([]); // for filter
  const [issuer, setIssuer] = React.useState([]); // for filter
  const [tenor, setTenor] = React.useState([]); // for filter
  const [pengelolaan, setPengelolaan] = React.useState([]); // for filter
  const [type, setType] = React.useState("monthly");
  const [pickerDate, setPickerDate] = React.useState("month");

  const [data, setData] = React.useState([]); // for table
  const [dataChart, setDataChart] = React.useState([]); // for chart

  React.useEffect(() => {
    getFilter();
    getData();
    getBankCustody();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilter = () => {
    if (filterStartDate.isAfter(filterEndDate)) {
      notification.error({
        message: "Periode awal tidak boleh lebih besar dari periode akhir",
      });
      return;
    }
  };

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
  const getData = async () => {
    const eq = QueryString.stringify({
      type: type,
      start_date: filterStartDate.format("YYYY-MM"),
      end_date: filterEndDate.format("YYYY-MM"),
      range:
        filterEndDate.diff(filterStartDate, pickerDate) +
        (pickerDate === "month" ? 1 : 2),
      custody: filterCustody,
      issuer: filterIssuer,
      kbmi: "all",
      kepemilikan: "all",
      tenor: filterTenor,
      pengelolaan: filterPengelolaan,
      subtipe: "sbi",
    });

    try {
      const {
        data: { data },
      } = await post("/porto/multi", eq);

      data.data.forEach((item) => {
        item.nominal = Number(item.nominal / 1000000);
      });
      data.dataTable.forEach((item) => {
        item.nominal = Number(item.nominal / 1000000);
      });
      setDataChart(data.data);
      setData(data.dataTable);
    } catch (error) {
      console.error(error);
      // notification.error({
      //   message: error.message,
      // });
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
      const [issuerData, tenorData, pengelolaanData] = await Promise.all([
        fetchData("/issuer/select"),
        fetchData("/master/select/tenor?tipe=sbi"),
        fetchData("/master/select/pengelolaan"),
      ]);

      const issuerList = createList(issuerData);
      const tenorList = createList(tenorData);
      const pengelolaanList = createList(pengelolaanData);

      setIssuer(issuerList);
      setTenor(tenorList);
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
      return "#5A6ACF";
    },
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
    // format y axis
    label: {
      position: "middle",
      formatter: (datum) => {
        return Number(datum.nominal).toLocaleString("id-ID");
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${Number(v).toLocaleString("id-ID")}`,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.period,
          value: Number(datum.nominal).toLocaleString("id-ID"),
        };
      },
    },
  };
  // column
  // Unique ID, Issuer, Tenor, Pengelolaan, No Security, Issued Date (start_date), Maturity Date (end_date), Nominal, Term of Interest (interest date), Sisa Tenor, Rate (%)

  const column = [
    {
      title: "Unique ID",
      dataIndex: "unique_id",
      key: "unique_id",
    },
    {
      title: "Bank Custody",
      dataIndex: "custody",
      key: "bank_custody",
      width: 250,
    },
    {
      title: "Issuer",
      dataIndex: "issuer",
      key: "issuer",
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
      title: "No Security",
      dataIndex: "no_security",
      key: "no_security",
    },
    {
      title: "Issued Date ",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
    },
    {
      title: "Maturity Date ",
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
      align: "right",
      render: (value) => {
        return value.toLocaleString("id-ID");
      },
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
        return text.toFixed(2);
      },
    },
  ];

  const onExport = () => {
    const newData = data.map((item) => {
      return {
        "Unique ID": item.unique_id,
        "Bank Custody": item.custody,
        Issuer: item.issuer,
        Tenor: item.tenor,
        Pengelolaan: item.pengelolaan,
        "No Security": item.no_security,
        "Issued Date": item.start_date,
        "Maturity Date": item.end_date,
        "Nominal (Jutaan)": item.nominal.toLocaleString("id-ID"),
        "Term of Interest": item.interest_date,
        "Sisa Tenor": item.sisa_tenor,
        "Rate (%)": item.rate.toFixed(2),
      };
    });

    newData.push({
      "Unique ID": "",
      "Bank Custody": "",
      Issuer: "",
      Tenor: "",
      Pengelolaan: "",
      "No Security": "",
      "Issued Date": "",
      "Maturity Date": "",
      "Nominal (Jutaan)": data
        .reduce((a, b) => a + Number(b.nominal), 0)
        .toLocaleString("id-ID"),
      "Term of Interest": "",
      "Sisa Tenor": "",
      "Rate (%)": "",
    });

    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

    XLSX.writeFile(wb, "SBI.xlsx");
  };
  const onTypeChange = (e) => {
    setData([]);
    if (e.target.value === "monthly") {
      setPickerDate("month");
    } else if (e.target.value === "yearly") {
      setPickerDate("year");
    }
    setType(e.target.value);
  };

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        SBI
      </Typography.Title>

      <Card className="mb-1">
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
              onChange={(value) => setFilterCustody(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 3}>
            <Typography.Text strong>Issuer</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 21}>
            <Select
              defaultValue={filterIssuer}
              options={issuer}
              onChange={(value) => setFilterIssuer(value)}
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
              onChange={(value) => setFilterTenor(value)}
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

      <Card className="mb-1">
        <Table
          dataSource={data}
          columns={column}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          bordered
          scroll={{ x: 2000 }}
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={8}>Total</Table.Summary.Cell>
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
        {/* export  */}
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
