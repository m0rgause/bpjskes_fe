import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Space, Typography, Button, notification, Tree } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { supabase } from "../../../config/supabase";

export function GroupAccess() {
  const params = useParams();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [treeSlc, setTreeSlc] = useState(0);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(false);

  let groupId = params.id;

  useEffect(() => {
    setIsLoading(true);
    getDataTree();
    getSelectedTree();
    setIsLoading(false);
  }, []);

  const getDataTree = async () => {
    const { data } = await supabase
      .rpc("aut_access_tree")
      .select("id, title, pos, urutan_path");

    let tree_data = [];
    let parent_data = [];
    let idxparent = "";
    data.map((row, idx) => {
      if (row.pos === 0) {
        tree_data[idx] = { title: row.title, key: row.id };
        tree_data[idx]["children"] = [];
        idxparent = idx;
        parent_data.push(row.id);
      } else if (row.pos === 3) {
        tree_data[idxparent]["children"][idx] = {
          title: row.title,
          key: row.id,
        };
      }
    });
    setTreeData(tree_data);
    setExpandedKeys(parent_data);
  };

  const getSelectedTree = async () => {
    const { data } = await supabase
      .from("aut_group_access")
      .select("aut_access_id")
      .eq("aut_group_id", groupId);

    let treeDataSlc = [];
    data.map((row) => {
      treeDataSlc.push(row.aut_access_id);
    });
    setTreeSlc(treeDataSlc);
  };

  const onCheck = (checkedKeysValue) => {
    setTreeSlc(checkedKeysValue);
  };

  const onUpdate = async () => {
    const { data, error } = await supabase
      .from("aut_group_access")
      .delete()
      .eq("aut_group_id", groupId);

    console.log("bfr", treeSlc);

    let errorMsg = null;
    let treeSlcFull = [];
    treeSlc.map(async (accId) => {
      const { error } = await supabase.from("aut_group_access").insert([
        {
          aut_group_id: groupId,
          aut_access_id: accId,
        },
      ]);
      errorMsg = error?.message;
      treeSlcFull.push(accId);

      const { data: accData, error: accError } = await supabase
        .from("aut_access")
        .select("pid")
        .eq("id", accId)
        .single();

      if (accData.pid != null && !treeSlc.includes(accData.pid)) {
        treeSlcFull.push(accData.pid);
      }
    });

    console.log("treeSlcFull", treeSlc);

    const { data: dataTree, error: errTree } = await supabase
      .rpc("aut_access_tree")
      .in("id", treeSlc);

    console.log("dataTree", dataTree);

    let listTree = [];
    let idxparent = "";
    dataTree.map((row, idx) => {
      if (row.pos === 0) {
        listTree[idx] = { title: row.title, url: row.url, icon: row.icon };
        listTree[idx]["children"] = [];
        idxparent = idx;
      } else if (row.pos === 3) {
        listTree[idxparent]["children"][idx] = {
          title: row.title,
          url: row.url,
          icon: row.icon,
        };
      }
    });

    console.log("listTree", listTree);

    // if (errorMsg) {
    //   notification.error({ message: error.message, placement: 'top', duration: 2 });
    // } else {
    //   notification.success({ message: 'Berhasil Simpan Data', placement: 'top', duration: 2 });
    //   history.push('/setting/group/list');
    // }
  };

  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  return (
    <>
      <Typography.Title level={4}>Pilih Menu</Typography.Title>

      <Tree
        checkable
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
    </>
  );
}
