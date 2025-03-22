import React from 'react';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Stack, Button, Tooltip } from '@mui/material';

const CustomToolbar = ({ onAddClick, addLabel = 'Add', showExport = true }) => {
  return (
    <GridToolbarContainer
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px'
      }}
    >
      <GridToolbarQuickFilter
        placeholder="Search..."
        style={{
          width: '200px',
          backgroundColor: '#fff',
          padding: '2px 4px',
          border: '1px solid #d7dce0'
        }}
      />

      <Stack direction="row" spacing={2} alignItems="center">
        {showExport && <GridToolbarExport style={{ fontSize: 14 }} />}
        <Tooltip title={addLabel} arrow>
          <Button
            variant="contained"
            color="primary"
            onClick={onAddClick}
            sx={{
              fontWeight: 'bold',
              textTransform: 'none',
              padding: '6px 16px'
            }}
          >
            {addLabel}
          </Button>
        </Tooltip>
      </Stack>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
