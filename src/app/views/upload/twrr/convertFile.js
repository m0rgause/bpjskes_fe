import React from "react";
import dayjs from "dayjs";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as xlsx from "xlsx";
import { merge } from "antd/es/theme/util/statistic";

const excelSerialDateToJSDate = (serial) => {
  // The Excel epoch starts on January 1, 1900
  const excelEpoch = new Date("1899-12-30T00:00:00Z");

  // Convert the Excel serial number to milliseconds
  const milliseconds = serial * 24 * 60 * 60 * 1000;

  const date = new Date(excelEpoch.getTime() + milliseconds);

  return date;
};

export function ConvertFile() {
  const [data, setData] = React.useState([]);
  const uploadFile = async (info) => {
    let fileIndex = info.fileList.length - 1;
    const uploadFile = info.fileList[fileIndex].originFileObj;
    const filename = info.fileList[fileIndex].name;
    const dataFile = await uploadFile.arrayBuffer();

    const workbook = xlsx.read(dataFile);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const lengthData = worksheet["!ref"];
    const dataXLS = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      range: `${lengthData}`,
    });

    let dataResult = [];
    let num = 0;
    let tanggal = "";
    dataXLS.forEach((row, idx) => {
      let label;
      let value;
      let list = [];

      if (row[2] === "as of") {
        let date = excelSerialDateToJSDate(row[3]);
        tanggal = dayjs(date).format("DD/MM/YYYY");
        if (dataXLS[idx + 5][0] === "ASSETS") {
          let xa_start = idx;
          let xa_end = xa_start + 25;
          for (let xa = xa_start; xa <= xa_end; xa++) {
            if (dataXLS[xa]) {
              if (
                dataXLS[xa][0] === "Total ASSETS" ||
                dataXLS[xa][2] === "Total ASSETS"
              ) {
                break;
              }
              let xa_data = dataXLS[xa];
              if (!xa_data[1]) {
                continue;
              }
              //   replace A/R or A/P and space afterthat with ''
              label = xa_data[1].replace(/A\/R|A\/P|\s/g, "");
              value = xa_data[3] !== 0 ? xa_data[3] : null;
              list.push({
                label,
                value,
              });
            }
          }
        }
      }

      if (row[0] === "Valuation date :") {
        tanggal = dayjs(excelSerialDateToJSDate(row[2])).format("DD/MM/YYYY");
        if (dataXLS[idx + 5][0] === "ASSETS") {
          let xa_start = idx;
          let xa_end = xa_start + 25;
          for (let xa = xa_start; xa <= xa_end; xa++) {
            if (dataXLS[xa]) {
              if (
                dataXLS[xa][0] === "Total ASSETS" ||
                dataXLS[xa][2] === "Total ASSETS"
              ) {
                break;
              }
              let xa_data = dataXLS[xa];
              if (!xa_data[1]) {
                continue;
              }
              //   replace A/R or A/P and space afterthat with ''
              label = xa_data[1].replace(/A\/R|A\/P|\s/g, "");
              value = xa_data[3] !== 0 ? xa_data[3] : null;
              list.push({
                label,
                value,
              });
            }
          }
        }
      }

      // liabilities
      if (row[0] === "LIABILITIES") {
        let x_start = idx;
        let x_end = x_start + 20;
        for (let x = x_start; x <= x_end; x++) {
          if (dataXLS[x]) {
            if (
              dataXLS[x][0] === "Total LIABILITIES" ||
              dataXLS[x][2] === "Total LIABILITIES"
            ) {
              break;
            }
            let xa_data = dataXLS[x];
            if (!xa_data[1]) {
              continue;
            }
            label = xa_data[1].replace(/A\/R|A\/P|\s/g, "");
            value = xa_data[3] !== 0 ? xa_data[3] : null;
            list.push({
              label,
              value,
            });
          }
        }
      }

      // if list not empty
      if (list.length !== 0) {
        dataResult.push({
          tanggal: tanggal,
          data: list,
        });
      }
    });
    // console.log(dataResult);
    // merge by tanggal
    let mergeByTanggal = dataResult.reduce((r, a) => {
      let returnHarian = {
        label: "ReturnHarian",
        value: null,
      };
      let returnAkumulasi = {
        label: "ReturnAkumulasi",
        value: null,
      };
      let beforeCash = {
        label: "TotalSebelumExternalCash",
        value: null,
      };
      let afterCash = {
        label: "TotalSetelahExternalCash",
        value: null,
      };
      let data = [
        ...a.data,
        returnHarian,
        returnAkumulasi,
        beforeCash,
        afterCash,
      ];
      r[a.tanggal] = [...(r[a.tanggal] || []), ...data];

      return r;
    }, {});

    // get header for column in table
    let header = [];
    mergeByTanggal[Object.keys(mergeByTanggal)[0]].forEach((item) => {
      header.push(item.label);
    });

    // data excel
    let dataExcel = [];
    Object.keys(mergeByTanggal).forEach((item) => {
      let data = {
        Date: item,
      };
      mergeByTanggal[item].forEach((item) => {
        data[item.label] = item.value;
      });

      dataExcel.push(data);
    });

    // export excel
    const ws = xlsx.utils.json_to_sheet(dataExcel);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "SheetJS");
    xlsx.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <>
      <Upload
        accept=".xls, .xlsx"
        onChange={uploadFile}
        showUploadList={false}
        beforeUpload={() => false}
      >
        <Button type="primary" icon={<UploadOutlined />} className="mb-1">
          Upload File
        </Button>
      </Upload>
    </>
  );
}
