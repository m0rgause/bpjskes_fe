import React from "react";
import { Card, Table, Spin, Typography, Row, Col, Button } from "antd";
import { Pie } from "@ant-design/plots";
import { useNavigate } from "react-router-dom";

export function SummaryPorto() {
  const [loading, setLoading] = React.useState(false);
  const isMobile = window.innerWidth <= 768;
  const history = useNavigate();

  const dataChart = [
    { type: "SBN", value: 27 },
    { type: "SBI", value: 25 },
    { type: "Deposito", value: 18 },
  ];

  const config = {
    appendPadding: 10,
    data: dataChart,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    // hide statistic
    statistic: false,
  };

  const columns = [
    {
      title: "Jenis",
      dataIndex: "jenis",
      key: "jenis",
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
    {
      title: "Presentase",
      dataIndex: "presentase",
      key: "presentase",
    },
    {
      title: "Aksi",
      dataIndex: "aksi",
      key: "aksi",
      render: (text, record) => {
        let push;
        if (record.jenis === "SBN") {
          push = "/porto/summary/sbn";
        } else if (record.jenis === "SBI") {
          push = "/porto/summary/sbi";
        } else if (record.jenis === "Deposito") {
          push = "/porto/summary/deposito";
        }
        return (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              history(push);
            }}
          >
            Detail
          </Button>
        );
      },
    },
  ];

  const dataSource = [
    {
      key: "1",
      jenis: "SBN",
      nominal: 100000000,
      presentase: "27%",
    },
    {
      key: "2",
      jenis: "SBI",
      nominal: 100000000,
      presentase: "25%",
    },
    {
      key: "3",
      jenis: "Deposito",
      nominal: 100000000,
      presentase: "18%",
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        Summary
      </Typography.Title>
      <Card>
        <Row gutter={[16, 16]}>
          <Col span={isMobile ? 24 : 8}>
            <Pie {...config} />
          </Col>
          <Col
            span={isMobile ? 24 : 16}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Table
              bordered
              columns={columns}
              dataSource={dataSource}
              pagination={{
                hideOnSinglePage: true,
              }}
              style={{
                width: isMobile ? "100%" : "100%",
              }}
            />
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}
