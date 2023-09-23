import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Table, Button, Tag } from 'antd'
import { EditOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons'
import moment from 'moment';
import { supabase } from '../../../config/supabase'

export function BukuList() {
  const history = useHistory()
  const dateFormat = 'DD-MM-YYYY'
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageTable, setPageTable] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [sortTable, setSortTable] = useState({
    field: 'title',
    order: 'ascend',
  });

  const columns = [
    {
      title: 'Judul',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      sorter: true,
      render: (text) => text ? moment(text).format(dateFormat) : '',
    },
    {
      title: 'Pengarang',
      dataIndex: 'pengarang',
      key: 'pengarang',
      sorter: true,
      render: (text) => <Tag color="green" style={{padding:5}} icon={<CheckCircleOutlined />} key={text}>{text.toUpperCase()}</Tag>,
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Button type="primary" icon={<EditOutlined />} onClick={() => history.push(`/setting/buku/${text}`)}>Edit</Button>,
    },
  ]

  useEffect(() => {  
    getData();
  }, [pageTable.current, sortTable.field, sortTable.order]);

  const getData = async() => {
    setIsLoading(true)
    let startPage = (pageTable.current - 1) * pageTable.pageSize;
    let endPage = (pageTable.current * pageTable.pageSize) - 1;
    const { data, count } = await supabase
                              .from('books')
                              .select('id, title, tanggal, pengarang', {count:'exact'})
                              .range(startPage, endPage)
                              .order(sortTable.field, { ascending: sortTable.order === 'ascend' ? true : false });

    let dataList = [];
    data.map(row => 
      dataList.push({...row, key:row.id})
    )              
    setData(dataList)
    
    setPageTable(prev => ({...prev, total:count}))
    setIsLoading(false)
  }

  const onChangeTable = (newPagination, filters, sorter) => {
    setPageTable(newPagination)
    setSortTable({
      field: sorter.field,
      order: sorter.order
    })
  }

  const onSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys);
    }
  }

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => history.push('/setting/buku/insert')} style={{marginBottom:10}}>Tambah</Button>

      <Table 
        columns={columns} 
        dataSource={data}
        pagination={pageTable}
        loading={isLoading}
        onChange={onChangeTable}
        rowSelection={onSelection}

      />
    </div>
  )
}