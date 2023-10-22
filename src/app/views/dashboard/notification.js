import React from "react";
import {
  Select,
  Card,
  Table,
  Button,
  Typography,
  Spin,
  Row,
  Col,
  Radio,
  Input,
} from "antd";
import dayjs from "dayjs";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { get, post } from "../../functions/helper";
import QueryString from "qs";
import * as XLSX from "xlsx";

export function Notification() {
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState("days");
  const [filterIsssuer, setFilterIssuer] = React.useState("all");
  const [filterCustody, setFilterCustody] = React.useState("all");
  const [range, setRange] = React.useState(0);

  const [issuer, setIssuer] = React.useState([]);
  const [custody, setCustody] = React.useState([]);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getData();
    getIssuer();
    getBankCustody();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    const body = {
      type: type,
      range: range,
      issuer: filterIsssuer,
      custody: filterCustody,
    };

    const {
      data: { data },
    } = await post("/notification", QueryString.stringify(body));

    data.map((item, index) => {
      item.key = index;
      item.nominal = parseInt(item.nominal);
      return item;
    });

    setData(data);
    setLoading(false);
  };

  const getIssuer = async () => {
    const {
      data: { data },
    } = await get("/issuer/select");

    let item = [{ value: "all", label: "All" }];
    data?.rows.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setIssuer({
      item: item,
      data: data.rows,
    });
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

  const onFilter = () => {
    getData();
  };
  const onTypeChange = (e) => {
    setType(e.target.value);
  };

  const columns = [
    {
      title: "Unique ID",
      dataIndex: "unique_id",
      key: "unique_id",
    },
    {
      title: "Bank Custody",
      dataIndex: "bank_custody",
      key: "bank_custody",
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
      title: "Pengeloalaan",
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
      title: "Issued Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (text) => dayjs(text).format("DD MMM YYYY"),
    },
    {
      title: "Maturity Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => {
        return (
          <div style={{ color: "red" }}>
            {dayjs(text).format("DD MMM YYYY")}
          </div>
        );
      },
    },
    {
      title: "Nominal (Jutaan)",
      dataIndex: "nominal",
      key: "nominal",
      align: "right",
      render: (text) => {
        return (text / 1000000).toLocaleString("id-ID");
      },
    },
    {
      title: "Term of Interest",
      dataIndex: "interest_date",
      key: "interest_date",
      render: (text) => dayjs(text).format("DD MMM YYYY"),
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

  const onExport = async () => {
    const fileName = `Notification -${range} ${type}`;
    const dataPush = [];
    data.forEach((element) => {
      dataPush.push({
        "Unique ID": element.unique_id,
        "Bank Custody": element.bank_custody,
        Issuer: element.issuer,
        KBMI: element.kbmi,
        Tenor: element.tenor,
        Pengelolaan: element.pengelolaan,
        Kepemilikan: element.kepemilikan,
        "No Security": element.no_security,
        "Issued Date": dayjs(element.start_date).format("DD MMM YYYY"),
        "Maturity Date": dayjs(element.end_date).format("DD MMM YYYY"),
        "Nominal (Jutaan)": (element.nominal / 1000000).toLocaleString("id-ID"),
        "Term of Interest": dayjs(element.interest_date).format("DD MMM YYYY"),
        "Sisa Tenor": element.sisa_tenor,
        "Rate (%)": element.rate,
      });
    });

    dataPush.push({
      "Unique ID": "Total",
      "Bank Custody": "",
      Issuer: "",
      KBMI: "",
      Tenor: "",
      Pengelolaan: "",
      Kepemilikan: "",
      "No Security": "",
      "Issued Date": "",
      "Maturity Date": "",
      "Nominal (Jutaan)":
        data.reduce((acc, curr) => acc + curr.nominal, 0) / 1000000,
      "Term of Interest": "",
      "Sisa Tenor": "",
      "Rate (%)": "",
    });

    const ws = XLSX.utils.json_to_sheet(dataPush);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notification");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const isMobile = window.innerWidth <= 768;
  return (
    <Spin spinning={loading}>
      <Typography.Title level={3} className="page-header">
        Notification
      </Typography.Title>

      <Card className="mb-1">
        <Row gutter={[16, 16]}>
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
              <Radio value="days">Days</Radio>
              <Radio value="months">Months</Radio>
              <Radio value="years">Years</Radio>
            </Radio.Group>
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Range</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            {/* input range number */}
            <Input
              style={{ width: "300px" }}
              placeholder="Input range number"
              type="number"
              min={1}
              onChange={(e) => {
                setRange(e.target.value);
              }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Bank Custody</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              options={custody}
              defaultValue={filterCustody}
              onChange={(e) => {
                setFilterCustody(e);
              }}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Issuer</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              options={issuer.item}
              defaultValue={filterIsssuer}
              onChange={(e) => {
                setFilterIssuer(e);
              }}
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
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 2500 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={8}>Total</Table.Summary.Cell>
              <Table.Summary.Cell colSpan={3} align="right">
                {(
                  data.reduce((acc, curr) => acc + curr.nominal, 0) / 1000000
                ).toLocaleString("id-ID")}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
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
