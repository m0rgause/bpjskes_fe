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
import { get, post, getFilterDate } from "../../../functions/helper";
import QueryString from "qs";
import * as XLSX from "xlsx";

export function ObligasiPorto() {
  const [loading, setLoading] = React.useState(false);

  const [filterStartDate, setfilterStartDate] = React.useState(getFilterDate().startDate);
  const [filterEndDate, setfilterEndDate] = React.useState(getFilterDate().endDate);
  const [filterIssuer, setFilterIssuer] = React.useState("all");
  const [filterKBMI, setFilterKBMI] = React.useState("all");
  const [filterTenor, setFilterTenor] = React.useState("all");
  const [filterKepemilikan, setFilterKepemilikan] = React.useState("all");
  const [filterPengelolaan, setFilterPengelolaan] = React.useState("all");
  const [filterCustody, setFilterCustody] = React.useState("all");

  const [pickerDate, setPickerDate] = React.useState("month");
  const [type, setType] = React.useState("monthly");

  const [issuer, setIssuer] = React.useState([]); // for filter
  const [kbmi, setKBMI] = React.useState([]); // for filter
  const [tenor, setTenor] = React.useState([]); // for filter
  const [kepemilikan, setKepemilikan] = React.useState([]); // for filter
  const [pengelolaan, setPengelolaan] = React.useState([]); // for filter
  const [custody, setCustody] = React.useState([]); // for filter

  const [data, setData] = React.useState([]); // for table
  const [dataChart, setDataChart] = React.useState([]); // for chart

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

    let item = [{ value: "all", label: "All Custody" }];
    data.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setCustody(item);
  };
  const onFilter = () => {
    if (filterStartDate.isAfter(filterEndDate)) {
      notification.error({
        message: "Error",
        description: "Periode awal tidak boleh lebih besar dari periode akhir",
        duration: 1,
      });
      return;
    }
    getData();
  };

  const getData = async () => {
    setLoading(true);
    const eq = QueryString.stringify({
      type: type,
      start_date: filterStartDate.format("YYYY-MM-DD"),
      end_date: filterEndDate.format("YYYY-MM-DD"),
      range:
        filterEndDate.diff(filterStartDate, pickerDate) +
        (pickerDate === "month" ? 1 : 2),
      custody: filterCustody,
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
       if(data.data.length === 0) {
        notification.warning({
          message: "Warning",
          description: "Data Belum Tersedia",
          duration: 1,
        });
      }
      data.data.forEach((item) => {
        item.nominal = Number(item.nominal / 1000000);
      });
      data.dataTable.forEach((item, index) => {
        item.nominal = Number(item.nominal / 1000000);
        item.key = index;
      });
      setDataChart(data.data);
      setData(data.dataTable);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onTypeChange = (e) => {
    setData([]);
    if (e === "monthly") {
      setPickerDate("month");
    } else if (e === "yearly") {
      setPickerDate("year");
    }
    setType(e);
  };

  const fetchData = async (endpoint) => {
    const response = await get(endpoint);
    return response.data.data.rows;
  };

  const createList = (data, label) => {
    const list = [{ value: "all", label: "All "+label }];
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
        fetchData("/issuer/select?tipe=obligasi"),
        fetchData("/master/select/kbmi"),
        fetchData("/master/select/tenor?tipe=obligasi"),
        fetchData("/master/select/kepemilikan"),
        fetchData("/master/select/pengelolaan"),
      ]);

      const issuerList = createList(issuerData, 'Issuer');
      const kbmiList = createList(kbmiData, 'KBMI');
      const tenorList = createList(tenorData, 'Tenor');
      const kepemilikanList = createList(kepemilikanData, 'Kepemilikan');
      const pengelolaanList = createList(pengelolaanData, 'Pengelolaan');

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
    minColumnWidth: '100%',
    maxColumnWidth: '100%',
    color: () => {
      return "#3AA0FF";
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
  // Unique ID, Issuer, KBMI, Tenor, Pengelolaan, Kepemilikan, No Security, Issued Date (start_date), Maturity Date (end_date), Nominal, Term of Interest (interest date), Sisa Tenor, Rate (%)

  const column = [
    {
      title: "Period",
      dataIndex: "tanggal",
      key: "tanggal",
    },
    {
      title: "Unique ID",
      dataIndex: "unique_id",
      key: "unique_id",
    },
    {
      title: "Bank Custody",
      dataIndex: "custody",
      key: "custody",
      width: 250,
    },
    {
      title: "Issuer",
      dataIndex: "issuer",
      key: "issuer",
    },
    // {
    //   title: "KBMI",
    //   dataIndex: "kbmi",
    //   key: "kbmi",
    // },
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
      title: "Sisa Tenor (Hari)",
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
        Period: item.tanggal,
        "Unique ID": item.unique_id,
        "Bank Custody": item.custody,
        Issuer: item.issuer,
        KBMI: item.kbmi,
        Tenor: item.tenor,
        Pengelolaan: item.pengelolaan,
        Kepemilikan: item.kepemilikan,
        "No Security": item.no_security,
        "Issued Date": item.start_date,
        "Maturity Date": item.end_date,
        "Nominal (Jutaan)": item.nominal.toLocaleString("id-ID"),
        "Term of Interest": item.interest_date,
        "Sisa Tenor (Hari)": item.sisa_tenor,
        "Rate (%)": item.rate.toFixed(2),
      };
    });

    newData.push({
      Period: "",
      "Unique ID": "",
      "Bank Custody": "",
      Issuer: "",
      KBMI: "",
      Tenor: "",
      Pengelolaan: "",
      Kepemilikan: "",
      "No Security": "",
      "Issued Date": "",
      "Maturity Date": "",
      "Nominal (Jutaan)": data
        .reduce((a, b) => a + Number(b.nominal), 0)
        .toLocaleString("id-ID"),
      "Term of Interest": "",
      "Sisa Tenor (Hari)": "",
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
              options={issuer}
              onChange={(value) => setFilterIssuer(value)}
              style={{ marginRight:10, minWidth:200 }}
            />
            <Select
              defaultValue={filterTenor}
              options={tenor}
              onChange={(value) => setFilterTenor(value)}
              style={{ marginRight:10 }}
            />
            <Select
              defaultValue={filterPengelolaan}
              options={pengelolaan}
              onChange={(value) => setFilterPengelolaan(value)}
              style={{ marginRight:10 }}
            />
            <Select
              defaultValue={filterKepemilikan}
              options={kepemilikan}
              onChange={(value) => setFilterKepemilikan(value)}
              style={{ marginRight:10 }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}></Col>
          <Col span={isMobile ? 24 : 22}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ marginRight:10 }}
              onClick={onFilter}
            >
              Filter
            </Button>
          </Col>
        </Row>
      </Card>

      {data.length !== 0 &&
      <>
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
          scroll={{ x: 2500 }}
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={11}>Total</Table.Summary.Cell>
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
      </>
      }

    </Spin>
  );
}
