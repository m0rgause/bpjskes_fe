import React from "react";
import dayjs from "dayjs";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as xlsx from "xlsx";
import { merge } from "antd/es/theme/util/statistic";

export function ConvertFile() {
  const [data, setData] = React.useState([]);
  const uploadFile = async (info) => {
    let fileIndex = info.fileList.length - 1;
    const uploadFile = info.fileList[fileIndex].originFileObj;
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
        tanggal = dayjs(row[3]).format("DD/MM/YYYY");
        if (dataXLS[idx + 5][0] === "ASSETS") {
          let xa_start = idx;
          let xa_end = xa_start + 20;
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
              if (xa_data[3]) {
                value = xa_data[3].includes("-")
                  ? null
                  : xa_data[3].replace(/\s/g, "");
                value = value === "0.00" ? null : value;
              } else {
                value = null;
              }
              list.push({
                label,
                value,
              });
            }
          }
        }
      }
      if (row[0] === "Valuation date :") {
        tanggal = dayjs(row[2], "DD/MM/YY").format("DD/MM/YYYY");

        if (dataXLS[idx + 5][0] === "ASSETS") {
          let xxa_start = idx;
          let xxa_end = xxa_start + 20;
          for (let xxa = xxa_start; xxa <= xxa_end; xxa++) {
            if (dataXLS[xxa]) {
              if (
                dataXLS[xxa][2] === "Total ASSETS" ||
                dataXLS[xxa][0] === "Total ASSETS" ||
                dataXLS[xxa][1] === "Total ASSETS"
              ) {
                break;
              }
              let xa_data = dataXLS[xxa];
              if (!xa_data[1]) {
                continue;
              }
              label = xa_data[1].replace(/A\/R|A\/P|\s/g, "");
              if (xa_data[3]) {
                value = xa_data[3].includes("-")
                  ? null
                  : xa_data[3].replace(/\s/g, "");
                value = value === "0.00" ? null : value;
              } else {
                value = null;
              }
              list.push({
                label,
                value,
              });
            }
          }
        }
      }
      // LIABILITIES
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
            if (xa_data[3]) {
              value = xa_data[3].includes("-")
                ? null
                : xa_data[3].replace(/\s/g, "");
              value = value === "0.00" ? null : value;
            } else {
              value = null;
            }
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

    // merge by tanggal
    let mergeByTanggal = dataResult.reduce((r, a) => {
      // r[a.tanggal] = [...(r[a.tanggal] || []), ...a.data];
      // add returnHarian and returnAkumulasi value null
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
    xlsx.writeFile(wb, "twrr.xlsx");
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
