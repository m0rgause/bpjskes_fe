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
  Radio,
  DatePicker,
  Modal,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { post } from "../../../functions/helper";
import * as XLXS from "xlsx";

export function ComparisonTWRR() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [type, setType] = React.useState("daily");
  const [listDate, setListDate] = React.useState([]);
  const [listDateFixed, setListDateFixed] = React.useState([]); // for table columns
  const [pickerDate, setPickerDate] = React.useState("daily");

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    let eq = {
      type: type,
      list_date: listDate,
    };
    let {
      data: { data: comparison },
    } = await post("/twrr/comparison", eq);
    comparison?.forEach((item) => {
      item.total_before_cash = item.total_before_cash / 1000000;
      item.total_after_cash = item.total_after_cash / 1000000;
    });
    setData(comparison);
    setLoading(false);
  };

  const onFilter = () => {
    // sort date ascending
    let list = [...listDate];
    list.sort((a, b) => {
      return dayjs(a).diff(dayjs(b));
    });
    setListDateFixed(list);
    getData();
  };

  const onTypeChange = (e) => {
    setListDate([]);
    setListDateFixed([]);
    if (e === "daily") {
      setPickerDate("date");
    } else if (e === "monthly") {
      setPickerDate("month");
    } else if (e === "yearly") {
      setPickerDate("year");
    }
  };

  const columns = [
    {
      title: "Comparison",
      dataIndex: "comparison",
      key: "comparison",
      width: 250,
    },
    ...listDateFixed.map((item, index) => {
      return {
        title:
          type === "daily"
            ? dayjs(item).format("DD MMM YYYY")
            : type === "monthly"
            ? dayjs(item).format("MMM YYYY")
            : type === "yearly"
            ? dayjs(item).format("YYYY")
            : "",
        dataIndex:
          type === "daily"
            ? item
            : type === "monthly"
            ? dayjs(item).endOf("month").format("YYYY-MM-DD")
            : type === "yearly"
            ? dayjs(item).endOf("year").format("YYYY-MM-DD")
            : "",
        key: index,
        render: (text, record) => {
          // next if first item1
          if (index === 0) {
            return text ? text.toLocaleString("id-ID") : 0;
          }
          let previousDate = "";
          let currentdate = "";
          if (type === "daily") {
            currentdate = item;
            // previousDate by index
            previousDate = listDateFixed[index - 1];
          } else if (type === "monthly") {
            currentdate = dayjs(item).endOf("month").format("YYYY-MM-DD");
            // previousDate = dayjs(item)
            //   .subtract(1, "month")
            //   .endOf("month")
            //   .format("YYYY-MM-DD");

            previousDate = dayjs(listDateFixed[index - 1])
              .endOf("month")
              .format("YYYY-MM-DD");
          } else if (type === "yearly") {
            currentdate = dayjs(item).endOf("year").format("YYYY-MM-DD");
            //   previousDate = dayjs(item)
            //     .subtract(1, "year")
            //     .endOf("year")
            //     .format("YYYY-MM-DD");

            previousDate = dayjs(listDateFixed[index - 1])
              .endOf("year")
              .format("YYYY-MM-DD");
          }

          let previousValue = record[previousDate] ?? 0;
          let currentValue = record[currentdate] ?? 0;
          let diff = currentValue - previousValue;
          return (
            <div>
              {text ? text.toLocaleString("id-ID") : 0}{" "}
              {diff > 0 ? (
                <span style={{ color: "green" }}>
                  <CaretUpOutlined />
                </span>
              ) : diff < 0 ? (
                <span style={{ color: "red" }}>
                  <CaretDownOutlined />
                </span>
              ) : (
                <span>
                  <MinusCircleOutlined />
                </span>
              )}
            </div>
          );
        },
      };
    }),
  ];

  const dataSource = [
    {
      key: 0,
      comparison: "Total Sebelum External Cash (Jutaan)",
    },
    {
      key: 1,
      comparison: "Total Sesudah External Cash (Jutaan)",
    },
    {
      key: 2,
      comparison: "Return Harian (%)",
    },
  ];
  data?.forEach((item) => {
    if (type === "daily") {
      dataSource[0][item.tanggal] = Number(item.total_before_cash) ?? 0;
      dataSource[1][item.tanggal] = Number(item.total_after_cash) ?? 0;
      dataSource[2][item.tanggal] = (item?.return_harian).toFixed(2) ?? 0;
    } else if (type === "monthly") {
      dataSource[0][dayjs(item.tanggal).endOf("month").format("YYYY-MM-DD")] =
        Number(item.total_before_cash) ?? 0;
      dataSource[1][dayjs(item.tanggal).endOf("month").format("YYYY-MM-DD")] =
        Number(item.total_after_cash) ?? 0;
      dataSource[2][dayjs(item.tanggal).endOf("month").format("YYYY-MM-DD")] =
        (item?.return_harian).toFixed(2) ?? 0;
    } else if (type === "yearly") {
      dataSource[0][dayjs(item.tanggal).endOf("year").format("YYYY-MM-DD")] =
        Number(item.total_before_cash) ?? 0;
      dataSource[1][dayjs(item.tanggal).endOf("year").format("YYYY-MM-DD")] =
        Number(item.total_after_cash) ?? 0;
      dataSource[2][dayjs(item.tanggal).endOf("year").format("YYYY-MM-DD")] =
        (item?.return_harian).toFixed(2) ?? 0;
    }
  });

  const onExport = async () => {
    const fileName = `Comparison TWRR ${type} ${dayjs().format("DD MMM YYYY")}`;

    const data = dataSource.map((item) => {
      let obj = {
        Comparison: item.comparison,
      };
      listDateFixed.forEach((date) => {
        let key =
          type === "daily"
            ? date
            : type === "monthly"
            ? dayjs(date).endOf("month").format("YYYY-MM-DD")
            : type === "yearly"
            ? dayjs(date).endOf("year").format("YYYY-MM-DD")
            : "";
        obj[key] = item[key] ?? 0;
      });
      return obj;
    });

    const wb = XLXS.utils.book_new();
    const ws = XLXS.utils.json_to_sheet(data);
    XLXS.utils.book_append_sheet(wb, ws, "Comparison");
    XLXS.writeFile(wb, `${fileName}.xlsx`);
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

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Comparison
      </Typography.Title>
      <Card className="mb-1">
        <Row gutter={[16, 16]}>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Period</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={type}
              options={[{key:0, value:'daily', label:'Daily'}, {key:1, value:'monthly', label:'Monthly'}, {key:2, value:'yearly', label:'Yearly'}]}
              onChange={(e) => {
                setType(e);
                onTypeChange(e);
              }}
              style={{ marginRight:10 }}
            />
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
          <Col span={isMobile ? 24 : 2}></Col>
          <Col span={isMobile ? 24 : 22}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              style={{ maxWidth:125, width: "100%" }}
              onClick={onFilter}
            >
              Filter
            </Button>
          </Col>
        </Row>
      </Card>

      {data !== null &&
      <>
      <Card>
        <Table
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={{
            hideOnSinglePage: true,
          }}
          className="mb-2"
          scroll={{ x: 1500 }}
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
      </>
      }

    </Spin>
  );
}
