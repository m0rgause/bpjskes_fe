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
} from "@ant-design/icons";
import dayjs from "dayjs";
import { get, post } from "../../../functions/helper";
import * as XLXS from "xlsx";

export function ComparisonPorto() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [type, setType] = React.useState("monthly");
  const [filterIssuer, setFilterIssuer] = React.useState("all");
  const [filterCustody, setFilterCustody] = React.useState("all");
  const [issuer, setIssuer] = React.useState({ item: [], data: [] }); // for filter
  const [listDate, setListDate] = React.useState([]);
  const [listDateFixed, setListDateFixed] = React.useState([]); // for table columns
  const [pickerDate, setPickerDate] = React.useState("month");
  const [custody, setCustody] = React.useState([]); // for filter

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

    let item = [{ value: "all", label: "All" }];
    data.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setCustody(item);
  };

  const getIssuer = async () => {
    const {
      data: { data },
    } = await get("/issuer/select");

    let item = [{ value: "all", label: "All" }];
    data.rows.forEach((element, index) => {
      item.push({ key: index, value: element.id, label: element.nama });
    });
    setIssuer({
      item: item,
      data: data.rows,
    });
  };

  const getData = async () => {
    setLoading(true);
    let eq = {
      type: type,
      list_date: listDate,
      issuer: filterIssuer,
      custody: filterCustody,
    };
    let {
      data: { data: comparison },
    } = await post("/porto/comparison", eq);

    comparison?.forEach((element) => {
      element.key = element.tipe;
      element.sum = Number(element.sum / 1000000);
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
    if (e.target.value === "monthly") {
      setPickerDate("month");
    } else if (e.target.value === "yearly") {
      setPickerDate("year");
    }
  };

  const columns = [
    {
      title: "Bank Custody",
      dataIndex: "bank_custody",
      key: "bank_custody",
      width: 250,
    },
    {
      title: "Comparison",
      dataIndex: "comparison",
      key: "comparison",
    },
    ...listDateFixed.map((item, index) => {
      return {
        title:
          type === "monthly"
            ? dayjs(item).format("MMM YYYY")
            : type === "yearly"
            ? dayjs(item).format("YYYY")
            : "",
        dataIndex:
          type === "monthly"
            ? dayjs(item).endOf("month").format("YYYY-MM-DD")
            : type === "yearly"
            ? dayjs(item).endOf("year").format("YYYY-MM-DD")
            : "",
        key: index,
        render: (text, record) => {
          //   // next if first item
          if (index === 0) {
            return text ? Number(text).toLocaleString("id-ID") : 0;
          }
          let previousDate = "";
          let currentdate = "";
          if (type === "monthly") {
            currentdate = dayjs(item).endOf("month").format("YYYY-MM-DD");
            previousDate = dayjs(item)
              .subtract(1, "month")
              .endOf("month")
              .format("YYYY-MM-DD");
          } else if (type === "yearly") {
            currentdate = dayjs(item).endOf("year").format("YYYY-MM-DD");
            previousDate = dayjs(item)
              .subtract(1, "year")
              .endOf("year")
              .format("YYYY-MM-DD");
          }
          let previousValue = record[previousDate]
            ? Number(record[previousDate])
            : 0;
          let currentValue = record[currentdate]
            ? Number(record[currentdate])
            : 0;
          let diff = currentValue - previousValue;
          return (
            <div>
              {text ? Number(text).toLocaleString("id-ID") : 0}{" "}
              {diff > 0 ? (
                <span style={{ color: "green" }}>
                  <CaretUpOutlined />
                </span>
              ) : diff < 0 ? (
                <span style={{ color: "red" }}>
                  <CaretDownOutlined />
                </span>
              ) : (
                ""
              )}
            </div>
          );
        },
      };
    }),
  ];

  // each issuer without all
  const dataSource = [
    {
      key: 1,
      comparison: "Deposito",
    },
    {
      key: 2,
      comparison: "Obligasi",
    },
    {
      key: 3,
      comparison: "SBN",
    },
    {
      key: 4,
      comparison: "SBI",
    },
  ];

  data?.forEach((item) => {
    let index = dataSource.findIndex((element) => {
      return element.comparison.toLowerCase() === item.tipe;
    });
    if (index !== -1) {
      dataSource[index][
        type === "monthly"
          ? dayjs(item.period).endOf("month").format("YYYY-MM-DD")
          : type === "yearly"
          ? dayjs(item.period).endOf("year").format("YYYY-MM-DD")
          : ""
      ] = item.sum;
      dataSource[index]["bank_custody"] = item.custody;
    }
  });

  const onExport = async () => {
    const fileName = `Comparison CKPN ${type} ${dayjs().format("DD MMM YYYY")}`;

    const data = dataSource.map((item) => {
      let obj = {
        comparison: item.comparison,
      };
      listDateFixed.forEach((element) => {
        obj[
          type === "monthly"
            ? dayjs(element).endOf("month").format("YYYY-MM-DD")
            : type === "yearly"
            ? dayjs(element).endOf("year").format("YYYY-MM-DD")
            : ""
        ] = item[
          type === "monthly"
            ? dayjs(element).endOf("month").format("YYYY-MM-DD")
            : type === "yearly"
            ? dayjs(element).endOf("year").format("YYYY-MM-DD")
            : ""
        ]
          ? Number(
              item[
                type === "monthly"
                  ? dayjs(element).endOf("month").format("YYYY-MM-DD")
                  : type === "yearly"
                  ? dayjs(element).endOf("year").format("YYYY-MM-DD")
                  : ""
              ]
            )
          : 0;
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
              onChange={(value) => setFilterCustody(value)}
              style={{ maxWidth: "300px", width: "100%" }}
            />
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Issuer</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue={filterIssuer}
              options={issuer.item}
              onChange={(value) => setFilterIssuer(value)}
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
          dataSource={dataSource}
          pagination={{
            hideOnSinglePage: true,
          }}
          bordered
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
    </Spin>
  );
}
