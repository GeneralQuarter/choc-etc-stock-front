import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { PropsWithChildren } from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1
    },
  }),
);

export default function MainBar({ children }: PropsWithChildren<any>) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title}>
            Choc Etc Stock
          </Typography>
          {children}
        </Toolbar>
      </AppBar>
    </div>
  )
}
