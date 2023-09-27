import React from "react";
import { Card, Table, Spin, Typography, Row, Col, Button } from "antd";
import { Pie } from "@ant-design/plots";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export function DetailDepositoPorto() {
  const [loading, setLoading] = React.useState(false);
  const isMobile = window.innerWidth <= 768;
  const [tab, setTab] = React.useState("kategori");
  const history = useNavigate();

  let dataChart;
  let dataSource;

  if (tab === "kategori") {
    dataChart = [
      { type: "KBM 4", value: 40 },
      { type: "KBM 3", value: 20 },
      { type: "KBM 2", value: 15 },
      { type: "KBM 1", value: 25 },
    ];
    dataSource = [
      {
        jenis: "KBM 4",
        nominal: 21750000,
        presentase: "40%",
      },
      {
        jenis: "KBM 3",
        nominal: 14049030,
        presentase: "20%",
      },
      {
        jenis: "KBM 2",
        nominal: 19619690,
        presentase: "15%",
      },
      {
        jenis: "KBM 1",
        nominal: 22952582,
        presentase: "25%",
      },
    ];
  } else if (tab === "tenor") {
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
  } else if (tab === "kepemilikan") {
    dataChart = [
      { type: "BUMN", value: 40 },
      { type: "BPD", value: 35 },
      { type: "Swasta", value: 25 },
    ];
    dataSource = [
      {
        jenis: "BUMN",
        nominal: 21750000,
        presentase: "40%",
      },
      {
        jenis: "BPD",
        nominal: 14049030,
        presentase: "35%",
      },
      {
        jenis: "Swasta",
        nominal: 19619690,
        presentase: "25%",
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
      key: "kategori",
      tab: "Kategori",
    },
    {
      key: "tenor",
      tab: "Tenor",
    },
    {
      key: "kepemilikan",
      tab: "Kepemilikan",
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
    kategori: (
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
    kepemilikan: (
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
        Detail Deposito
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
