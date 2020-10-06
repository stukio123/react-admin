import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Container, Row, Col } from "react-bootstrap";
import {
  Table,
  Form,
  Input,
  Upload,
  Button,
  message,
  Space,
  Select,
} from "antd";
import Modal from "../../components/UI/Modal";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, getAllCategory } from "../../actions";
import { storage, firebase } from "../../helpers/firebase";
import {
  PlusCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import "./style.css";
const { Option } = Select;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const Products = (props) => {
  const [form] = Form.useForm();
  const [editShow, setEditShow] = useState(false);
  const [addShow, setAddShow] = useState(false);
  const [fileList, setFileList] = useState([]);
  var list = [];
  const category = useSelector((state) => state.category);
  const product = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const columns = [
    {
      title: "Mã Sản Phẩm",
      dataIndex: "_id",
      key: "_id",
      width: '15%',
    },
    {
      title: "Ảnh Sản Phẩm",
      dataIndex: "mainImage",
      key: "mainImage",
      width: 'fit-content',
      render: (record) => (
        <img
          alt={record}
          src={record}
          style={{ width: "170px", height: "130px" }}
        />
      ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tên Thương Hiệu",
      dataIndex: "brand",
      key: "age",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 'fit-content',
      render: (record) => <a>{record.name}</a>,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      width: 'fit-content',
      render: () => <a>Xóa</a>,
    },
  ];

  const handleClose = () => {
    setEditShow(false);
    setAddShow(false);
    list = [];
  };

  const handleAddProduct = (values) => {
    const { name, brand, category, attrs, description } = values;
    console.log(values);
    const value = {
      name: name,
      brand: brand,
      description: description,
      attrs: attrs,
      category: category,
      productImages: list,
    };
    const newProduct = JSON.stringify(value);
    console.log(newProduct);
    dispatch(addProduct(newProduct)).then(result => {
      if(result)
        dispatch(getAllCategory())
    });
    list = [];
    setAddShow(false);
  };

  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name });
      if (category.children.length > 0) {
        createCategoryList(category.children, options);
      }
    }
    return options;
  };

  const handleAddShow = () => setAddShow(true);
  const handleEditShow = () => setEditShow(true);

  const expandedRowRender = () => {
    const col = [
      {
        title: "size",
        dataIndex: "size",
        key: "size",
      },
      {
        title: "số lượng",
        dataIndex: "stock",
        key: "stock",
      },
      {
        title: "Giá tiền",
        dataIndex: "price",
        key: "price",
      },
    ];

    const data = product.products.map((products) => products.attrs);
    console.log(data);
    return (
      <Table
        columns={col}
        dataSource={data}
        bordered="true"
        pagination={false}
      />
    );
  };

  const renderProducts = () => {
    return (
      <Table
        dataSource={product.products}
        columns={columns}
        bordered="true"
        expandable={{ expandedRowRender }}
      ></Table>
    );
  };

  const renderAddProductModal = () => {
    const customRequest = async ({ onSuccess, onError, file }) => {
      console.log(file);
      const storageRef = await storage.ref();
      var uploadTask = storageRef.child(`images/${file.name}`).put(file);
      uploadTask.on(
        "state_changed",
        function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        function (error) {
          // Handle unsuccessful uploads
          // CONNECT ON ERROR
          onError(error);
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log("File available at", downloadURL);
            onSuccess(downloadURL);
            list.push({ img: downloadURL });
            console.log("fileList " + list);
          });
        }
      );
    };

    const uploadButton = (
      <div>
        <PlusCircleOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Modal
        title={`Thêm Sản Phẩm`}
        visible={addShow}
        size={`600px`}
        cancel={handleClose}
        style={{ top: 20 }}
        ok={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleAddProduct(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form form={form} layout="horizontal" size={"large"}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            labelAlign="left"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
          >
            <Input
              style={{ float: "right", display: "block" }}
              placeholder="Tên sản phẩm"
            />
          </Form.Item>
          <Form.Item
            label="Tên thương hiệu"
            name="brand"
            labelAlign="left"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
          >
            <Input style={{ float: "right" }} placeholder="Tên thương hiệu" />
          </Form.Item>
          <Form.Item
            label="Mô Tả"
            name="description"
            labelAlign="left"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
          >
            <Input style={{ float: "right" }} placeholder="Mô tả sản phẩm" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Chọn danh mục"
            labelAlign="left"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
          >
            <Select className="form-control" placeholder="Chọn danh mục">
              {createCategoryList(category.categories).map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="productImages"
            label="Ảnh sản phẩm"
            valuePropName="fileList"
            extra="Chọn ảnh JPEG hoặc PNG"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              customRequest={customRequest}
              beforeUpload={beforeUpload}
              // onChange={({ file, fileList }) => {
              //   console.log("file on change");
              // }}
            >
              {uploadButton}
            </Upload>
          </Form.Item>
          <Form.List name="attrs" label="Thuộc tính">
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field) => (
                    <Space
                      key={field.key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, "size"]}
                        fieldKey={[field.fieldKey, "size"]}
                        rules={[
                          { required: true, message: "Missing first name" },
                        ]}
                      >
                        <Input placeholder="Size" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "stock"]}
                        fieldKey={[field.fieldKey, "stock"]}
                        rules={[
                          { required: true, message: "Missing last name" },
                        ]}
                      >
                        <Input placeholder="Số Lượng" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "price"]}
                        fieldKey={[field.fieldKey, "price"]}
                        rules={[
                          { required: true, message: "Missing last name" },
                        ]}
                      >
                        <Input placeholder="Giá" />
                      </Form.Item>

                      {fields.length === 1 ? null : (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                    >
                      <PlusOutlined /> Thêm thuộc tính
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form>
      </Modal>
    );
  };

  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div className="headerContainer" style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Products</h3>
              <Button onClick={handleAddShow}>Thêm Sản Phẩm</Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>{renderProducts()}</Col>
        </Row>
      </Container>
      {renderAddProductModal()}
    </Layout>
  );
};

export default Products;
