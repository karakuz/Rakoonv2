import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from 'axios'
import ProductCard from '../product/product_card';
import { Col, Row, Container } from 'react-bootstrap';
import '../../pages/css/bootstrap.min.css';
import '../../pages/css/body.css';

const Search = (props) => {
  const [products, setProducts] = useState([]);
  const { keyword } = useParams();

  const getProducts = async () => {
    const res = await Axios({
      method: "POST",
      withCredentials: true,
      url: `http://3.67.85.199:4000/search/${keyword}`,
    });
    setProducts(res.data);
  }

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Container>
        <Row>
          {
            products.map((product) => {
              return (
                <Col sm={12} md={6} lg={4} xl={3}>
                  <ProductCard key={product.item_id} {...product} isRemovable={false} numOfItems={props.numOfItems} setNumOfItems={props.setNumOfItems} />;
                </Col>
              );
            })
          }
        </Row>
      </Container>
    </div>
  )
}

export default Search