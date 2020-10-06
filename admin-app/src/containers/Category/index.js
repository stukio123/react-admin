import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategory,
  addCategory,
  delCategory,
  updateCategory,
} from "../../actions";
import { Form, Input, Select, Table, Popconfirm } from "antd";
import Modal from "../../components/UI/Modal";
import "antd/dist/antd.css";
import "./style.css";

const { Option } = Select;

const Category = (props) => {
  const category = useSelector((state) => state.category);
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [editValues, setEditValues] = useState([
    { _id: "", name: "", parentId: "" },
  ]);

  useEffect(() => {
    console.log("Update danh sách");
    if (editShow) {
      form.setFieldsValue({
        _id: editValues._id,
        name: editValues.name,
        parentId: editValues.parentId,
      });
    }
  }, [editShow]);

  const handleSubmit = (values) => {
    console.log(values);
    dispatch(addCategory(values));
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
    setEditShow(false);
  };

  const handleShow = () => setShow(true);

  const renderCategories = (categories) => {
    let myCategories = [];
    for (let category of categories) {
      myCategories.push(
        <li key={category.name}>
          {category.name}
          {category.children.length > 0 ? (
            <ul>{renderCategories(category.children)}</ul>
          ) : null}
        </li>
      );
    }

    return myCategories;
  };

  const handleDelete = (id) => {
    console.log(id);
    dispatch(delCategory(id)).then((result) => {
      if (result) {
        dispatch(getAllCategory());
      }
    });
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

  const handleEditCategory = (values) => {
    console.log("handleEditCategory " + values._id);
    dispatch(updateCategory(values)).then((result) => {
      if (result) {
        dispatch(getAllCategory());
      }
    });
    setEditShow(false);
  };

  const renderEditCategory = () => {
    return (
      <Modal
        forceRender
        visible={editShow}
        cancel={handleClose}
        title={`Sửa Danh Mục`}
        size={`600px`}
        style={{ top: 20 }}
        ok={() => {
          form
            .validateFields()
            .then((values) => {
              console.log("validate form" + values);
              form.resetFields();
              handleEditCategory(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          size={"medium"}
        >
          <Form.Item name="_id"></Form.Item>
          <Form.Item label="Tên danh mục" name="name">
            <Input style={{ marginLeft: "10px" }} />
          </Form.Item>
          <Form.Item name="parentId">
            <Select
              className="form-control"
              placeholder="Chọn danh mục cha"
              value={editValues.parentId}
            >
              {createCategoryList(category.categories).map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const columns = [
    { title: "id", dataIndex: "_id", key: "_id", width: 300 },
    { title: "Tên Danh mục", dataIndex: "name", key: "name" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      align: "center",
      render: (record) => (
        <Popconfirm
          title="Bạn chắc chắn chứ ??"
          onConfirm={() => handleDelete(record._id)}
        >
          <a style={{ color: "blue" }}>Xóa </a>
        </Popconfirm>
      ),
    },
  ];

  const renderAddCategory = () => {
    return (
      <Modal
        visible={show}
        cancel={handleClose}
        title={`Thêm Danh Mục`}
        size={`600px`}
        style={{ top: 20 }}
        ok={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values);
              form.resetFields();
              handleSubmit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          size={"medium"}
        >
          <Form.Item label="Tên danh mục" name="name">
            <Input style={{ marginLeft: "10px" }} />
          </Form.Item>
          <Form.Item name="parentId">
            <Select className="form-control" placeholder="Chọn danh mục cha">
              {createCategoryList(category.categories).map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Danh mục</h3>
              <button onClick={handleShow}>Thêm danh mục</button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {/* <ul>{renderCategories(category.categories)}</ul> */}
            <Table
              onRow={(record, rowIndex) => {
                return {
                  onDoubleClick: (event) => {
                    console.log(record);
                    setEditValues(record);
                    setEditShow(true);
                  }, // double click row
                };
              }}
              columns={columns}
              expandable={{
                rowExpandable: (record) =>
                  record.children.parentId !== null &&
                  record.children.length > 0,
              }}
              dataSource={category.categories}
            />
          </Col>
        </Row>
      </Container>
      {renderAddCategory()}
      {renderEditCategory()}
    </Layout>
  );
};

export default Category;
