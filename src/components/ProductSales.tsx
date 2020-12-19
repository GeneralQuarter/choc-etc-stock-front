import React, { useEffect, useRef, useState } from 'react';
import useAPIState from '../api/use-api-state';
import { ProductCumulatedSale } from '../model/product-cumulated-sale';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  Button,
  Paper,
  Table, TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography
} from '@material-ui/core';
import { format } from 'date-fns';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import { PointOfSale } from '../model/point-of-sale';
import { CSVLink } from 'react-csv';

interface ProductSalesProps {
  pointOfSale: PointOfSale | null;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    toolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    title: {
      flex: '1 1 100%',
    },
    dateInput: {
      marginRight: theme.spacing(2)
    },
    saveButton: {
      minWidth: '150px'
    }
  }),
);

const csvHeaders = [
  { label: 'Désignation', key: 'designation' },
  { label: 'Référence', key: 'reference' },
  { label: 'Cumul des ventes', key: 'quantitySum' },
];

export default function ProductSales({pointOfSale}: ProductSalesProps) {
  const [{data: sales}, setEndUrl] = useAPIState<ProductCumulatedSale[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [csvFilename, setCsvFilename] = useState('');
  const classes = useStyles();
  const csvLink = useRef<any>();

  useEffect(() => {
    if (!pointOfSale) {
      return;
    }

    const searchParams = new URLSearchParams();

    if (startDate) {
      searchParams.append('startDate', format(startDate, 'yyyy-MM-dd'));
    }

    if (endDate) {
      searchParams.append('endDate', format(endDate, 'yyyy-MM-dd'));
    }

    const queryParams = searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '';

    setEndUrl(`/point-of-sales/${pointOfSale.id}/product-cumulated-sales${queryParams}`)
  }, [pointOfSale, setEndUrl, startDate, endDate]);

  const saveToCsv = () => {
    if (!pointOfSale || sales.length === 0) {
      return;
    }

    const start = startDate ? format(startDate, 'yyyy-MM-dd') : 'X';
    const end = endDate ? format(endDate, 'yyyy-MM-dd') : 'X';

    setCsvFilename(`${pointOfSale.name} - Ventes - du ${start} au ${end}.csv`);
    setTimeout(() => {
      csvLink.current.link.click();
    }, 0);
  }

  return (
    <>
      <Paper className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" component="div" className={classes.title}>
            Ventes
          </Typography>
          <KeyboardDatePicker
            className={classes.dateInput}
            variant="inline"
            id="start-date-picker"
            emptyLabel=""
            placeholder="Début"
            format="dd/MM/yyyy"
            disableFuture
            onChange={d => setStartDate(d)}
            value={startDate}/>
          <KeyboardDatePicker
            className={classes.dateInput}
            variant="inline"
            id="end-date-picker"
            emptyLabel=""
            placeholder="Fin"
            format="dd/MM/yyyy"
            disableFuture
            onChange={d => setEndDate(d)}
            value={endDate}/>
            <Button
              className={classes.saveButton}
              variant="outlined"
              startIcon={<Icon>save</Icon>}
              onClick={() => saveToCsv()}>
              Sauvegarder
            </Button>
          <CSVLink
            data={sales}
            headers={csvHeaders}
            ref={csvLink}
            filename={csvFilename}
            target="_blank" />
        </Toolbar>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Désignation</TableCell>
                <TableCell align="right">Référence</TableCell>
                <TableCell align="right">Cumul des ventes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell component="th" scope="row">
                    {sale.designation}
                  </TableCell>
                  <TableCell align="right">{sale.reference}</TableCell>
                  <TableCell align="right">{sale.quantitySum}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}
