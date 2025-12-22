import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Status,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import { apiGet, normalizeActivity } from '../api/client';

const statusVariant = (value) => {
  switch (value) {
    case 'online':
    case 'published':
      return 'success';
    case 'offline':
      return 'danger';
    default:
      return 'secondary';
  }
};

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

export default function ActivityList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const payload = await apiGet('/api/activities/custom-list');
        const list = (payload?.data || []).map(normalizeActivity);
        if (alive) setItems(list);
      } catch (err) {
        if (alive) setError(err.message || 'Failed to load activities.');
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Box padding={6} background="neutral100" minHeight="100vh">
      <Flex direction="column" gap={4}>
        <Box>
          <Typography variant="alpha">Activities</Typography>
          <Typography variant="epsilon" textColor="neutral600">
            Manage activity entries from Strapi.
          </Typography>
        </Box>

        {error ? (
          <Status variant="danger">{error}</Status>
        ) : null}

        <Box background="neutral0" padding={4} hasRadius shadow="tableShadow">
          <Table colCount={5} rowCount={items.length}>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>Status</Th>
                <Th>End Time</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={5}>Loading...</Td>
                </Tr>
              ) : null}
              {!loading && items.length === 0 ? (
                <Tr>
                  <Td colSpan={5}>No activities found.</Td>
                </Tr>
              ) : null}
              {!loading &&
                items.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.id}</Td>
                    <Td>{item.meta_title || item.title || '-'}</Td>
                    <Td>
                      <Status variant={statusVariant(item.activityStatus || item.status)}>
                        {item.activityStatus || item.status || 'draft'}
                      </Status>
                    </Td>
                    <Td>{formatDateTime(item.endTime)}</Td>
                    <Td>
                      <Button
                        as={Link}
                        to={`/activities/${item.id}`}
                        size="S"
                        variant="secondary"
                      >
                        Edit
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
}

