import React from "react";
import {
  Card,
  Table,
  DatePicker,
  Spin,
  Typography,
  Row,
  Col,
  Button,
  Radio,
  notification,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DualAxes } from "@ant-design/plots";
import { post } from "../../../functions/helper";
import * as XLXS from "xlsx";

export function ExternalCash() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(
    dayjs().subtract(1, "months")
  );
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());

  const [data, setData] = React.useState([]);
  const [totalAkumulasi, setTotalAkumulasi] = React.useState(0);
  const [totalAkumulasiRaw, setTotalAkumulasiRaw] = React.useState(0);
  const [dataChart, setDataChart] = React.useState({ data: [], uvBill: [] });
  const [type, setType] = React.useState("daily");
  const [pickerDate, setPickerDate] = React.useState("date");

  const onTypeChange = (e) => {
    if (e.target.value === "daily") {
      setPickerDate("date");
    } else if (e.target.value === "monthly") {
      setPickerDate("month");
    } else if (e.target.value === "yearly") {
      setPickerDate("year");
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

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
    let diffType = pickerDate === "date" ? "day" : pickerDate;
    let eq = {
      type: type,
      startDate: filterStartDate.format("YYYY-MM-DD"),
      endDate: filterEndDate.format("YYYY-MM-DD"),
      rangeDate:
        filterEndDate.diff(filterStartDate, diffType) +
        (diffType === "year" ? 2 : 1),
    };

    let {
      data: { data: externalCash },
    } = await post("/twrr/external-cash", eq);

    if (externalCash.length === 0) {
      notification.warning({
        message: "Warning",
        description: "Data Belum Tersedia",
      });
    }

    let returnAkumulasi = 0;
    externalCash = externalCash?.map((item, index) => {
      item.key = index;
      returnAkumulasi += Number(item.return_harian);
      return item;
    });
    setTotalAkumulasiRaw(returnAkumulasi);
    setData(externalCash);
    setTotalAkumulasi(returnAkumulasi.toFixed(2));

    setDataChart({
      data: transformData(externalCash),
      uvBill: uvBillData(externalCash),
    });

    setLoading(false);
  };

  const transformData = (data) => {
    let result = [];
    data?.forEach((element) => {
      let period = dayjs(element.period);
      result.push({
        time:
          type === "daily"
            ? period.format("DD MMM YYYY")
            : type === "monthly"
            ? period.format("MMM YYYY")
            : period.format("YYYY"),
        Akumulasi: element.return_akumulasi,
      });
    });
    return result;
  };

  const uvBillData = (data) => {
    let result = [];
    data?.forEach((element) => {
      let period = dayjs(element.period);
      result.push({
        time:
          type === "daily"
            ? period.format("DD MMM YYYY")
            : type === "monthly"
            ? period.format("MMM YYYY")
            : period.format("YYYY"),
        value: parseInt(element.total_before_cash),
        type: "Total Sebelum External Cash",
      });
      result.push({
        time:
          type === "daily"
            ? period.format("DD MMM YYYY")
            : type === "monthly"
            ? period.format("MMM YYYY")
            : period.format("YYYY"),
        value: parseInt(element.total_after_cash),
        type: "Total Sesudah External Cash",
      });
    });
    return result;
  };

  const config = {
    data: [dataChart.uvBill, dataChart.data],
    xField: "time",
    yField: ["value", "Akumulasi"],
    geometryOptions: [
      {
        geometry: "column",
        isGroup: true,
        seriesField: "type",
        color: ["#FAD337", "#3AA0FF"],
        columnStyle: {
          radius: [10, 10, 0, 0],
        },
        tooltip: {
          formatter: (datum) => {
            return {
              name: datum.type,
              value: parseInt(datum.value).toLocaleString("id-ID"),
            };
          },
        },
      },
      {
        geometry: "line",
        point: {
          shape: "circle",
          size: 4,
          style: {
            fill: "white",
            stroke: "#4ECB73",
            lineWidth: 2,
          },
        },
        color: "#4ECB73",
        smooth: true,
        lineStyle: { lineWidth: 2 },
      },
    ],
    // label on left side of chart
    yAxis: {
      Akumulasi: {
        label: {
          formatter: (text) => {
            return text + "%";
          },
        },
      },

      value: {
        label: {
          formatter: (text) => {
            return parseInt(text).toLocaleString("id-ID");
          },
        },
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        offset: 10,
        style: {
          fontSize: 12,
          fill: "#aaa",
        },
      },
    },
    legend: {
      position: "bottom",
    },
  };

  const columns = [
    {
      title: "Periode",
      dataIndex: "period",
      key: "periode",
      render: (text) => {
        let period = dayjs(text);
        return type === "daily"
          ? period.format("DD MMM YYYY")
          : type === "monthly"
          ? period.format("MMM YYYY")
          : period.format("YYYY");
      },
    },
    {
      title: "Total Sebelum External Cash",
      dataIndex: "total_before_cash",
      key: "total_sebelum",
      align: "right",
      render: (text) => {
        return parseInt(text).toLocaleString("id-ID");
      },
    },
    {
      title: "Total Sesudah External Cash",
      dataIndex: "total_after_cash",
      key: "total_after_cash",
      align: "right",
      render: (text) => {
        return parseInt(text).toLocaleString("id-ID");
      },
    },
    {
      title: "Return Harian",
      dataIndex: "return_harian",
      key: "return_harian",
      render: (text) => {
        return text ? text.toFixed(2) + "%" : "0%";
      },
    },
  ];

  const onExport = async () => {
    let diffType = pickerDate === "date" ? "day" : pickerDate;
    let eq = {
      type: type,
      startDate: filterStartDate.format("YYYY-MM-DD"),
      endDate: filterEndDate.format("YYYY-MM-DD"),
      rangeDate:
        filterEndDate.diff(filterStartDate, diffType) +
        (diffType === "year" ? 2 : 1),
    };
    let {
      data: { data: externalCash },
    } = await post("/twrr/external-cash", eq);
    externalCash = externalCash.map((item, index) => {
      item.key = index;
      return item;
    });
    const fileName = `External Cash ${type}`;

    const data = externalCash.map((item) => {
      let period = dayjs(item.period);
      return {
        Periode:
          type === "daily"
            ? period.format("DD MMM YYYY")
            : type === "monthly"
            ? period.format("MMM YYYY")
            : period.format("YYYY"),
        "Total Sebelum External Cash": parseInt(
          item.total_before_cash
        ).toLocaleString("id-ID"),
        "Total Sesudah External Cash": parseInt(
          item.total_after_cash
        ).toLocaleString("id-ID"),
        "Return Harian": (item?.return_harian ?? 0).toFixed(2) + "%",
        "Total Return Akumulasi":
          (item?.return_akumulasi ?? 0).toFixed(2) + "%",
      };
    });
    const worksheet = XLXS.utils.json_to_sheet(data);
    const workbook = XLXS.utils.book_new();
    XLXS.utils.book_append_sheet(workbook, worksheet, "External Cash");
    XLXS.writeFile(workbook, `${fileName}.xlsx`);
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        External Cash
      </Typography.Title>
      <Row gutter={[8, 8]}>
        <Col span={isMobile ? 24 : 18}>
          <Card
            className="mb-1"
            style={{
              minHeight: "125px",
            }}
          >
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
                  <Radio value="daily">Daily</Radio>
                  <Radio value="monthly">Monthly</Radio>
                  <Radio value="yearly">Yearly</Radio>
                </Radio.Group>
              </Col>
              <Col span={isMobile ? 24 : 2}>
                <Typography.Text strong>Period</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <div>
                  <DatePicker
                    id="startDate"
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
                    id="endDate"
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
              <Col span={isMobile ? 24 : 2}></Col>
              <Col span={isMobile ? 24 : 22}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ maxWidth: "150px", width: "100%" }}
                  onClick={onFilter}
                >
                  Filter
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={isMobile ? 24 : 6}>
          <Card
            style={{
              minHeight: "125px",
              height: "95% ",
            }}
            className={isMobile ? "mb-1" : ""}
          >
            <Typography.Title level={5} className="page-header">
              Total Return Akumulasi
            </Typography.Title>
            <Typography.Title
              level={3}
              className="page-header"
              style={{
                marginTop: "0",
                marginBottom: "0",
              }}
            >
              {totalAkumulasi} %
            </Typography.Title>
            {/*<Typography.Title
              level={5}
              className="page-header"
              style={{
                marginTop: "0",
              }}
            >
              {totalAkumulasiRaw}
            </Typography.Title>*/}
          </Card>
        </Col>
      </Row>
      <Card
        className="mb-1"
        style={{
          maxWidth: "100%",
        }}
      >
        <DualAxes
          style={{
            minWidth: "100%",
            maxWidth: "5000px",
          }}
          {...config}
        />
      </Card>
      <Card className="mb-1">
        <Table
          bordered
          columns={columns}
          dataSource={data}
          scroll={{ x: 500 }}
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
    </Spin>
  );
}
