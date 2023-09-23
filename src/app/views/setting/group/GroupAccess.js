import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Space,
  Typography,
  Button,
  notification,
  Tree,
  Card,
  Spin,
} from "antd";
import { SaveOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import { get, put } from "../../../functions/helper";
import qs from "qs";

export function GroupAccess() {
  const params = useParams();
  const history = useNavigate();
  const [treeData, setTreeData] = useState([]);
  const [treeSlc, setTreeSlc] = useState([]);
  const [loading, setLoading] = useState(false);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(false);

  let groupId = params.id;

  useEffect(() => {
    getDataTree();
    getSelectedTree();
    // eslint-disable-next-line
  }, []);

  const getDataTree = async () => {
    setLoading(true);
    const {
      data: { data: menu },
    } = await get(`/access/list?pid=1`, {});

    let accParentList = [];
    let accList = [];
    await Promise.all(
      menu.map(async (row, idx) => {
        accParentList.push(row.id);
        accList[idx] = { key: row.id, title: row.title };

        const {
          data: { data: menuchild },
        } = await get(`/access/list?pid=${row.id}`, {});

        if (menuchild) {
          let children = [];
          menuchild.forEach((rowchild) => {
            children.push({ key: rowchild.id, title: rowchild.title });
          });
          accList[idx]["children"] = children;
        }
      })
    );

    setExpandedKeys(accParentList);
    setTreeData(accList);
    setLoading(false);
  };

  const getSelectedTree = async () => {
    const {
      data: { data },
    } = await get(`/group_access/list?group_id=${groupId}`, {});
    let treeDataSlc = [];
    data.forEach((row) => {
      treeDataSlc.push(row.aut_access_id);
    });
    setTreeSlc(treeDataSlc);
  };

  const onCheck = (checkedKeysValue) => {
    setTreeSlc(checkedKeysValue.checked);
  };

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onUpdate = async () => {
    setLoading(true);
    await put(
      `/group_access/update/${params.id}`,
      qs.stringify({ groupId, treeSlc })
    )
      .then((res) => {
        notification.success({
          message: "Berhasil ubah data",
          placement: "top",
          duration: 2,
        });
        history("/setting/group/list");
      })
      .catch((err) => {
        notification.error({
          message: err.response.data.message,
          placement: "top",
          duration: 2,
        });
      });
    setLoading(false);
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
        Pilih Menu
      </Typography.Title>
      <Card>
        <Tree
          checkable
          checkStrictly={true}
          treeData={treeData}
          checkedKeys={treeSlc}
          onCheck={onCheck}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        />

        <Space style={{ marginTop: 30 }}>
          <Button
            type="primary"
            onClick={() => onUpdate()}
            icon={<SaveOutlined />}
          >
            Simpan
          </Button>
        </Space>
      </Card>
    </Spin>
  );
}
