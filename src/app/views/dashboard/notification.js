import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Typography,
  Spin,
  Row,
  Col,
  DatePicker,
  Radio,
} from "antd";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";

export function Notification() {
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState("daily");
  const [listDate, setListDate] = React.useState([]);
  const [listDateFixed, setListDateFixed] = React.useState([]); // for table columns
  const navigate = useNavigate();

  const onFilter = () => {};

  const onTypeChange = (e) => {
    setType(e.target.value);
    setListDate([]);
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
              <Radio value="daily">Daily</Radio>
              <Radio value="monthly">Monthly</Radio>
              <Radio value="yearly">Yearly</Radio>
            </Radio.Group>
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
    </Spin>
  );
}
