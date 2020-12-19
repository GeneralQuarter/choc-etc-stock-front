import React, { useEffect, useState } from 'react';
import useAPIState from './api/use-api-state';
import { PointOfSale } from './model/point-of-sale';
import { Container, MenuItem, Select } from '@material-ui/core';
import MainBar from './components/MainBar';
import ProductSales from './components/ProductSales';

function App() {
  const [{data: pointOfSales}] = useAPIState<PointOfSale[]>([], '/point-of-sales');
  const [pointOfSale, setPointOfSale] = useState<PointOfSale | null>(null);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!event.target.value) {
      setPointOfSale(null);
    }

    const id = parseInt(event.target.value as string);
    const pos = pointOfSales.find(p => p.id === id);

    setPointOfSale(pos ?? null);
  };

  useEffect(() => {
    if (pointOfSale === null && pointOfSales.length > 0) {
      setPointOfSale(pointOfSales[0])
    }
  }, [pointOfSale, pointOfSales]);

  return (
    <>
      <MainBar>
        <Select labelId="point-of-sale-select-label"
                id="point-of-sale-select"
                value={pointOfSale ? pointOfSale.id.toFixed() : ''}
                onChange={handleChange}>
          {pointOfSales.map(pos => <MenuItem key={pos.id} value={pos.id}>{pos.name}</MenuItem>)}
        </Select>
      </MainBar>
      <Container fixed>
        <ProductSales pointOfSale={pointOfSale}/>
      </Container>
    </>
  );
}

export default App;
