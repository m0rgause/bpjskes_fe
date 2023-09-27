import React from "react";
import { Card, Table, Spin, Typography, Row, Col, Button } from "antd";
import { Pie } from "@ant-design/plots";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export function DetailSBNPorto() {
  const [loading, setLoading] = React.useState(false);
  const isMobile = window.innerWidth <= 768;
  const [tab, setTab] = React.useState("tenor");
  const history = useNavigate();

  let dataChart;
  let dataSource;

  if (tab === "tenor") {
    dataChart = [
      { type: "1 Bulan", value: 35 },
      { type: "2 Bulan", value: 45 },
      { type: "Doc", value: 20 },
    ];
    dataSource = [
      {
        jenis: "1 Bulan",
        nominal: 21750000,
        presentase: "35%",
      },
      {
        jenis: "2 Bulan",
        nominal: 14049030,
        presentase: "45%",
      },
      {
        jenis: "Doc",
        nominal: 19619690,
        presentase: "20%",
      },
    ];
  } else if (tab === "pengelolaan") {
    dataChart = [
      { type: "Konvensional", value: 80 },
      { type: "Syariah", value: 20 },
    ];
    dataSource = [
      {
        jenis: "Konvensional",
        nominal: 21750000,
        presentase: "80%",
      },
      {
        jenis: "Syariah",
        nominal: 14049030,
        presentase: "20%",
      },
    ];
  }

  const onTabChange = (key) => {
    setTab(key);
  };

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

  const tabList = [
    {
      key: "tenor",
      tab: "Tenor",
    },
    {
      key: "pengelolaan",
      tab: "Pengelolaan",
    },
  ];

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
    },
    {
      title: "Presentase",
      dataIndex: "presentase",
      key: "presentase",
    },
  ];

  const contentList = {
    tenor: (
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={{
          hideOnSinglePage: true,
        }}
        style={{
          width: "100%",
        }}
      />
    ),

    pengelolaan: (
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        pagination={{
          hideOnSinglePage: true,
        }}
        style={{
          width: "100%",
        }}
      />
    ),
  };

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        <Button
          type="link"
          className="icon-back"
          icon={<ArrowLeftOutlined />}
          onClick={() => history(-1)}
        />
        Detail SBN
      </Typography.Title>
      <Card
        tabList={tabList}
        activeTabKey={tab}
        onTabChange={(key) => {
          onTabChange(key);
        }}
      >
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
            {contentList[tab]}
          </Col>
        </Row>
      </Card>
    </Spin>
  );
}
