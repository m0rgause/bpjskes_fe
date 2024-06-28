import React from "react";
import {
  Card,
  Table,
  Spin,
  Typography,
  Row,
  Col,
  Button,
  Select,
  notification,
  DatePicker,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { get, post, getFilterDate } from "../../../functions/helper";
import QueryString from "qs";
import * as XLSX from "xlsx";

export function DetailCKPN() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(
    getFilterDate().startDate
  );
  const [filterEndDate, setfilterEndDate] = React.useState(
    getFilterDate().endDate
  );
  const [filterIssuer, setFilterIssuer] = React.useState("all");
  const [filterCustody, setFilterCustody] = React.useState("all");
  const [issuer, setIssuer] = React.useState({ item: [], data: [] }); // for filter
  const [data, setData] = React.useState([]); // for table
  const [totalECL, setTotalECL] = React.useState(0);
  const [custody, setCustody] = React.useState([]); // for filter

  const isMobile = window.innerWidth <= 768;

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

  const getData = async () => {
    setLoading(true);
    let eq = {
      start: filterStartDate.format("YYYY-MM-DD"),
      end: filterEndDate.format("YYYY-MM-DD"),
      range: filterStartDate.diff(filterEndDate, "month"),
      issuer: filterIssuer,
      custody: filterCustody,
    };

    const {
      data: { data },
    } = await post("/ckpn/detail", QueryString.stringify(eq));
    if (data.length === 0) {
      notification.warning({
        message: "Warning",
        description: "Data Belum Tersedia",
        duration: 1,
      });
    }
    const dataSource = [];
    data.forEach((element, index) => {
      dataSource.push({
        key: index,
        tanggal: element.tanggal,
        tipe: element.tipe,
        unique_id: element.unique_id,
        custody_name: element.custody_name,
        issuer_name: element.issuer_name,
        kbmi_name: element.kbmi_name,
        tenor_name: element.tenor_name,
        pengelolaan_name: element.pengelolaan_name,
        kepemilikan_name: element.kepemilikan_name,
        no_security: element.no_security,
        start_date: element.start_date,
        end_date: element.end_date,
        nominal: element.nominal / 1000000,
        interest_date: element.interest_date,
        sisa_tenor: element.sisa_tenor,
        rate: element.rate,
        pd: element.pd,
        lgd: element.lgd,
        ecl: element.ecl ? Number(element.ecl / 1000000) : 0,
      });
    });

    setTotalECL(dataSource.reduce((total, element) => total + element.ecl, 0));

    setData(dataSource);
    setLoading(false);
  };

  const getIssuer = async () => {
    const {
      data: { data },
    } = await get("/issuer/select");

    let item = [{ value: "all", label: "All Issuer" }];
    data.rows.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setIssuer({
      item: item,
      data: data.rows,
    });
  };

  const columns = [
    {
      title: "Tanggal",
      dataIndex: "tanggal",
      key: "tanggal",
      render: (text) => {
        return dayjs(text).format("DD MMM YYYY");
      },
    },
    {
      title: "Tipe",
      dataIndex: "tipe",
      key: "tipe",
    },
    {
      title: "Unique ID",
      dataIndex: "unique_id",
      key: "unique_id",
    },
    {
      title: "Bank Custody",
      dataIndex: "custody_name",
      key: "custody",
      width: 200,
    },
    {
      title: "Issuer",
      dataIndex: "issuer_name",
      key: "issuer",
    },
    {
      title: "KBMI",
      dataIndex: "kbmi_name",
      key: "kbmi",
    },
    {
      title: "Tenor",
      dataIndex: "tenor_name",
      key: "tenor",
    },
    {
      title: "Pengelolaan",
      dataIndex: "pengelolaan_name",
      key: "pengelolaan",
    },
    {
      title: "Kepemilikan",
      dataIndex: "kepemilikan_name",
      key: "kepemilikan",
    },
    {
      title: "No Security",
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
      align: "right",
      render: (text) => (text ? Number(text).toLocaleString("id-ID") : 0),
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
      align: "right",
      render: (text) => (text ? Number(text).toLocaleString("id-ID") : 0),
    },
  ];

  const onExport = async () => {
    const fileName = `Detail CKPN ${filterStartDate.format(
      "MM-YYYY"
    )} - ${filterEndDate.format("MM-YYYY")}.xlsx`;

    const dataExport = data.map((element) => {
      return {
        Period: dayjs(element.tanggal).format("DD MMM YYYY"),
        Tipe: element.tipe,
        "Unique ID": element.unique_id,
        "Bank Custody": element.custody_name,
        Issuer: element.issuer_name,
        KBMI: element.kbmi_name,
        Tenor: element.tenor_name,
        Pengelolaan: element.pengelolaan_name,
        Kepemilikan: element.kepemilikan_name,
        "No Security": element.no_security,
        "Issued Date": element.start_date,
        "Maturity Date": element.end_date,
        "Nominal (Jutaan)": Number(element.nominal).toLocaleString("id-ID"),
        "Term of Interest": element.interest_date,
        "Sisa Tenor (Hari)": element.sisa_tenor,
        "Rate (%)": element.rate.toFixed(2),
        PD: element.pd.toFixed(2),
        "LGD (%)": element.lgd,
        "ECL (Jutaan)": Number(element.ecl).toLocaleString("id-ID"),
      };
    });

    dataExport.push({
      Period: "Total",
      Tipe: "",
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
      "Nominal (Jutaan)": "",
      "Term of Interest": "",
      "Sisa Tenor (Hari)": "",
      "Rate (%)": "",
      PD: "",
      "LGD (%)": "",
      "ECL (Jutaan)": Number(totalECL).toLocaleString("id-ID"),
    });

    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Detail CKPN");
    XLSX.writeFile(wb, fileName);
  };

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Detail
      </Typography.Title>

      <Card className="mb-1" style={{ minHeight: "175px" }}>
        <Row gutter={[8, 8]}>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Period</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <DatePicker
              picker="month"
              defaultValue={filterStartDate}
              onChange={(date) => setfilterStartDate(date)}
              style={{marginRight:10}}
            />
            <DatePicker
              picker="month"
              defaultValue={filterEndDate}
              onChange={(date) => setfilterEndDate(date)}
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
              style={{ marginRight:10, minWidth:200 }}
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
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            showSizeChanger: false,
            hideOnSinglePage: true,
          }}
          bordered
          scroll={{ x: 2500 }}
          summary={() => {
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={18}>
                  <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell colSpan={1}>
                  <div style={{ textAlign: "right" }}>
                    <strong>{totalECL?.toLocaleString("id-ID")}</strong>
                  </div>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
        <Button
          type="primary"
          style={{
            backgroundColor: "#4ECB73",
          }}
          onClick={onExport}
          icon={<DownloadOutlined />}
        >
          Export Excel
        </Button>
      </Card>
      </>
      }

    </Spin>
  );
}
