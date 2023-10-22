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
import QueryString from "qs";
import * as XLSX from "xlsx";

export function SummaryCKPN() {
  const [loading, setLoading] = React.useState(false);

  const [type, setType] = React.useState("monthly");
  const [listDate, setListDate] = React.useState([]);
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
    // sort date ascending
    let list = [...listDate];
    list.sort((a, b) => {
      return dayjs(a).diff(dayjs(b));
    });
    setListDate(list);
    getData();
  };

  const isMobile = window.innerWidth <= 768;

  const getData = async () => {
    const eq = {
      type: type,
      listDate: listDate,
      issuer: filterBank,
      custody: filterCustody,
    };
    console.log(eq);
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
          custody: element.custody,
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

  const getBankCustody = async () => {
    const {
      data: { data },
    } = await get("/custody");
    console.log(data);

    let item = [{ value: "all", label: "All" }];
    data.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setCustody(item);
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

  const onTypeChange = (e) => {
    setListDate([]);
    if (e.target.value === "monthly") {
      setPickerDate("month");
    } else if (e.target.value === "yearly") {
      setPickerDate("year");
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
      title: "Bank Custody",
      dataIndex: "custody",
      key: "custody",
    },
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
    const fileName = `Summary CKPN ${type}.xlsx`;

    const dataExport = dataChart.map((element) => {
      return {
        "Bank Custody": element.custody,
        Issuer: element.bank,
        ECL: Number(element.return).toLocaleString("id-ID"),
      };
    });

    dataExport.push({
      "Bank Custody": "Total",
      Issuer: "",
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
    </Spin>
  );
}
