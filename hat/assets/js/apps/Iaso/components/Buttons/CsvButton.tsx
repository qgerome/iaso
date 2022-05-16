import React, { FunctionComponent } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import SaveAlt from '@material-ui/icons/SaveAlt';

type Props = {
    csvUrl: string;
    variant: 'contained' | 'outlined' | 'text';
};

const styles = theme => ({
    button: {
        marginLeft: theme.spacing(2),
        '& svg, & i': {
            marginRight: theme.spacing(1),
        },
    },
});

const useStyles = makeStyles(styles);

export const CsvButton: FunctionComponent<Props> = ({
    csvUrl,
    variant = 'contained',
}) => {
    const classes = useStyles();
    return (
        <Button
            data-test="csv-export-button"
            variant={variant}
            className={classes.button}
            color="primary"
            href={csvUrl}
        >
            <SaveAlt />
            CSV
        </Button>
    );
};