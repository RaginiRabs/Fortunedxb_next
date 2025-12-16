'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  Card,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import EmptyState from './EmptyState';

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  emptyTitle = 'No data found',
  emptyDescription = 'Get started by creating a new item.',
  emptyActionLabel = 'Add New',
  onEmptyAction = null,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check if any actions exist
  const hasActions = onView || onEdit || onDelete;

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        showAction={Boolean(onEmptyAction)}
      />
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((row, index) => (
          <Card
            key={row.id || index}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            {columns.map((column) => (
              <Box
                key={column.field}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  py: 1,
                  borderBottom: '1px solid',
                  borderColor: 'grey.100',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                  }}
                >
                  {column.headerName}
                </Typography>
                <Box sx={{ textAlign: 'right', maxWidth: '60%' }}>
                  {column.renderCell ? (
                    column.renderCell(row[column.field], row)
                  ) : (
                    <Typography variant="body2">
                      {row[column.field] || '-'}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}

            {/* Actions - Only show if at least one action exists */}
            {hasActions && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1,
                  mt: 2,
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'grey.200',
                }}
              >
                {onView && (
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      onClick={() => onView(row)}
                      sx={{
                        bgcolor: 'grey.100',
                        '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                      }}
                    >
                      <VisibilityOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onEdit && (
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(row)}
                      sx={{
                        bgcolor: 'grey.100',
                        '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                      }}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(row)}
                      sx={{
                        bgcolor: 'grey.100',
                        '&:hover': { bgcolor: 'error.main', color: '#fff' },
                      }}
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Card>
        ))}
      </Box>
    );
  }

  // Desktop Table View
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  py: 2,
                  whiteSpace: 'nowrap',
                }}
              >
                {column.headerName}
              </TableCell>
            ))}
            {hasActions && (
              <TableCell
                align="right"
                sx={{
                  fontWeight: 600,
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  py: 2,
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id || index}
              sx={{
                '&:hover': { bgcolor: 'grey.50' },
                '&:last-child td': { border: 0 },
              }}
            >
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ py: 2 }}>
                  {column.renderCell
                    ? column.renderCell(row[column.field], row)
                    : row[column.field] || '-'}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell align="right" sx={{ py: 2 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}
                  >
                    {onView && (
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => onView(row)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': { color: 'primary.main', bgcolor: 'primary.50' },
                          }}
                        >
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onEdit && (
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(row)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': { color: 'primary.main', bgcolor: 'primary.50' },
                          }}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(row)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': { color: 'error.main', bgcolor: 'error.50' },
                          }}
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}