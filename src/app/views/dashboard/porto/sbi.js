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
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";

export function SBIPorto() {
  const [loading, setLoading] = React.useState(false);
  const [filterStartDate, setfilterStartDate] = React.useState(dayjs());
  const [filterEndDate, setfilterEndDate] = React.useState(dayjs());

  const onFilter = () => {
    setLoading(true);
  };

  const isMobile = window.innerWidth <= 768;

  const dataChart = [
    { tanggal: "Mei 2021", return: 3000 },
    { tanggal: "Mei 2022", return: 20000 },
    { tanggal: "Mei 2023", return: 30000 },
  ];

  const config = {
    data: dataChart,
    xField: "tanggal",
    yField: "return",
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      tanggal: { alias: "Tanggal" },
      return: { alias: "Return" },
    },
    minColumnWidth: isMobile ? 24 : 100,
    maxColumnWidth: isMobile ? 24 : 100,
    color: () => {
      return "#3AA0FF";
    },
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
  };

  const columns = [
    {
      title: "Period",
      dataIndex: "period",
      key: "period",
    },
    {
      title: "Nama Efek",
      dataIndex: "namaEfek",
      key: "namaEfek",
    },
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
    },
    {
      title: "Rata-rata Yield",
      dataIndex: "rataRataYield",
      key: "rataRataYield",
    },
    {
      title: "Tanggal Pembelian",
      dataIndex: "tanggalPembelian",
      key: "tanggalPembelian",
    },
    {
      title: "Date Realisasi",
      dataIndex: "dateRealisasi",
      key: "dateRealisasi",
    },
    {
      title: "Tanggal Jatuh Tempo",
      dataIndex: "tanggalJatuhTempo",
      key: "tanggalJatuhTempo",
    },
    {
      title: "Date Cutoff",
      dataIndex: "dateCutoff",
      key: "dateCutoff",
    },
    {
      title: "Tenor (Hari)",
      dataIndex: "tenor",
      key: "tenor",
    },
    {
      title: "Tenor (Bulan)",
      dataIndex: "tenorBulan",
      key: "tenorBulan",
    },
    {
      title: "Nominal Beli",
      dataIndex: "nominalBeli",
      key: "nominalBeli",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
    {
      title: "Face Value saat Jatuh Tempo",
      dataIndex: "faceValue",
      key: "faceValue",
      align: "right",
      render: (text) => text.toLocaleString("id-ID"),
    },
  ];

  const dataSource = [
    {
      period: "Mei 2021",
      namaEfek: "SUN 2021",
      kode: "SPN",
      rataRataYield: "5.00%",
      tanggalPembelian: "21/05/2021",
      dateRealisasi: "21/05/2021",
      tanggalJatuhTempo: "21/05/2021",
      dateCutoff: "21/05/2021",
      tenor: "367",
      tenorBulan: "12",
      nominalBeli: 100000000,
      faceValue: 100000000,
    },
    {
      period: "Mei 2021",
      namaEfek: "SUN 2021",
      kode: "SPN",
      rataRataYield: "5.00%",
      tanggalPembelian: "21/05/2021",
      dateRealisasi: "21/05/2021",
      tanggalJatuhTempo: "21/05/2021",
      dateCutoff: "21/05/2021",
      tenor: "367",
      tenorBulan: "12",
      nominalBeli: 100000000,
      faceValue: 100000000,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} className="page-header">
        SBN
      </Typography.Title>
      <Row gutter={[8, 8]}>
        <Col span={isMobile ? 24 : 18}>
          <Card className="mb-1" style={{ minHeight: "175px" }}>
            <Row gutter={[8, 8]}>
              <Col span={isMobile ? 24 : 2}>
                <Typography.Text strong>Period</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <DatePicker
                  defaultValue={filterStartDate}
                  onChange={(date) => setfilterStartDate(date)}
                />{" "}
                -{" "}
                <DatePicker
                  defaultValue={filterEndDate}
                  onChange={(date) => setfilterEndDate(date)}
                />
              </Col>

              <Col span={isMobile ? 24 : 2}>
                <Typography.Text strong>Tenor</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <Select
                  defaultValue="all"
                  options={[
                    { value: "all", label: "Semua" },
                    { value: "1", label: "1 - 3 Bulan" },
                    { value: "2", label: "2 - 4 Bulan" },
                    { value: "3", label: "3 - 5 Bulan" },
                  ]}
                  style={{ maxWidth: "300px", width: "100%" }}
                />
              </Col>
              <Col span={isMobile ? 24 : 2}>
                <Typography.Text strong>Pengelolaan</Typography.Text>
              </Col>
              <Col span={isMobile ? 24 : 22}>
                <Select
                  defaultValue="konvensional"
                  options={[
                    { value: "swasta", label: "Swasta" },
                    { value: "pemerintah", label: "Pemerintah" },
                    { value: "konvensional", label: "Konvensional" },
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
        </Col>
        <Col span={isMobile ? 24 : 6}>
          <Card style={{ minHeight: "175px" }}>
            <Typography.Title level={5} className="page-header">
              Total ECL
            </Typography.Title>
            <Typography.Title level={3} className="page-header">
              0.5%
            </Typography.Title>
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
          scroll={{ x: 1000 }}
          summary={() => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell colSpan={10}>Total</Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    {dataSource
                      .reduce((acc, cur) => {
                        return acc + cur.nominalBeli;
                      }, 0)
                      .toLocaleString("id-ID")}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    {dataSource
                      .reduce((acc, cur) => {
                        return acc + cur.faceValue;
                      }, 0)
                      .toLocaleString("id-ID")}
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
        >
          Export Excel
        </Button>
      </Card>
    </Spin>
  );
}
