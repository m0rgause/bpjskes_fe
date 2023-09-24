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
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export function ComparisonCKPN() {
  const [loading, setLoading] = React.useState(false);

  const onFilter = () => {
    setLoading(true);
  };

  const isMobile = window.innerWidth <= 768;

  const columns = [
    {
      title: "Comparison",
      dataIndex: "comparison",
      key: "comparison",
    },
    {
      title: "1 Mei 2021",
      dataIndex: "mei",
      key: "mei",
    },
    {
      title: "1 Mei 2022",
      dataIndex: "mei2",
      key: "mei2",
    },
    {
      title: "1 Mei 2023",
      dataIndex: "mei3",
      key: "mei3",
    },
  ];

  const dataSource = [
    {
      key: "1",
      comparison: "BSI",
      mei: 350,
      mei2: 900,
      mei3: 300,
    },
    {
      key: "2",
      comparison: "BNI",
      mei: 220,
      mei2: 300,
      mei3: 450,
    },
    {
      key: "3",
      comparison: "BRI",
      mei: 130,
      mei2: 600,
      mei3: 150,
    },
  ];

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
            <Radio.Group defaultValue="daily">
              <Radio value="daily">Daily</Radio>
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
              placeholder="Select Period"
              style={{ maxWidth: "300px", width: "100%" }}
            >
              <Select.Option value="2019-03">2019-03</Select.Option>
              <Select.Option value="2019-04">2019-04</Select.Option>
              <Select.Option value="2019-05">2019-05</Select.Option>
            </Select>
          </Col>
          <Col span={isMobile ? 24 : 2}>
            <Typography.Text strong>Bank</Typography.Text>
          </Col>
          <Col span={isMobile ? 24 : 22}>
            <Select
              defaultValue="mandiri"
              options={[
                { value: "mandiri", label: "Mandiri" },
                { value: "bca", label: "BCA" },
                { value: "bni", label: "BNI" },
              ]}
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
          className="mb-1"
          scroll={{ x: 500 }}
        />
        <Button
          type="primary"
          style={{
            backgroundColor: "#4ECB73",
          }}
          icon={<DownloadOutlined />}
        >
          Export Excel
        </Button>
      </Card>
    </Spin>
  );
}
