import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  DateTimePicker,
  Divider,
  Flex,
  JSONInput,
  NumberInput,
  SingleSelect,
  SingleSelectOption,
  Status,
  Tabs,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { ArrowLeft } from '@strapi/icons';
import { apiGet, apiPut, apiUploadFiles, normalizeActivity, toAbsoluteUrl } from '../api/client';

const statusOptions = ['draft', 'online', 'offline'];

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toIso = (value) => (value ? value.toISOString() : null);

const normalizeEntity = (item) => {
  if (!item) return null;
  if (item.attributes) return { id: item.id, ...item.attributes };
  return item;
};

const parseJsonArray = (value) => {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
};

const toImageItems = (items) =>
  (items || [])
    .filter(Boolean)
    .map((item) => {
      if (typeof item === 'string') return { url: item };
      if (item.url) return { url: item.url, alt: item.alt || null };
      return null;
    })
    .filter(Boolean);

const toAvatarItems = (items) =>
  (items || [])
    .filter(Boolean)
    .map((item) => ({
      name: item.name || '',
      avatarUrl: item.avatarUrl || item.avatar || '',
      phoneMask: item.phoneMask || null,
    }));

const statusBadgeVariant = (value) => {
  switch (value) {
    case 'online':
      return 'success';
    case 'offline':
      return 'danger';
    default:
      return 'secondary';
  }
};

const Section = ({ title, description, children }) => (
  <Box paddingBottom={5}>
    <Typography variant="epsilon">{title}</Typography>
    {description ? (
      <Typography variant="pi" textColor="neutral600">
        {description}
      </Typography>
    ) : null}
    <Box paddingTop={3}>{children}</Box>
  </Box>
);

const BannerImages = ({
  items,
  onChange,
  onUpload,
  uploading,
}) => {
  const inputRef = useRef(null);

  return (
    <Flex direction="column" gap={3}>
      <Flex alignItems="center" justifyContent="space-between" wrap="wrap" gap={2}>
        <Typography variant="pi" fontWeight="bold">
          banner.images
        </Typography>
        <Button
          variant="secondary"
          size="S"
          onClick={() => inputRef.current && inputRef.current.click()}
          loading={uploading}
        >
          上传图片
        </Button>
      </Flex>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        style={{ display: 'none' }}
      />

      {items.length === 0 ? (
        <Box
          padding={6}
          background="neutral100"
          hasRadius
          borderColor="neutral200"
          borderWidth="1px"
          borderStyle="dashed"
        >
          <Typography variant="pi" textColor="neutral600">
            点击“上传图片”添加素材
          </Typography>
        </Box>
      ) : (
        <Flex direction="column" gap={2}>
          {items.map((url, index) => (
            <Flex
              key={`${url}-${index}`}
              alignItems="center"
              justifyContent="space-between"
              gap={3}
              padding={2}
              background="neutral0"
              borderColor="neutral200"
              borderWidth="1px"
              borderStyle="solid"
              hasRadius
            >
              <Flex alignItems="center" gap={3} style={{ minWidth: 0 }}>
                <Box
                  background="neutral100"
                  borderColor="neutral200"
                  borderWidth="1px"
                  borderStyle="solid"
                  hasRadius
                  overflow="hidden"
                  width="56px"
                  height="56px"
                >
                  <img
                    src={toAbsoluteUrl(url)}
                    alt={url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="pi" textColor="neutral700" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {url}
                </Typography>
              </Flex>
              <Button
                variant="tertiary"
                size="S"
                onClick={() => onChange(items.filter((_, idx) => idx !== index))}
              >
                删除
              </Button>
            </Flex>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default function ActivityEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [merchants, setMerchants] = useState([]);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [form, setForm] = useState({
    meta_title: '',
    meta_version: '',
    slug: '',
    activityStatus: 'draft',
    startTime: null,
    endTime: null,
    minDiscountCount: 0,
    currentOrderCount: 0,
    sort: 100,
    highlightsRaw: '[]',
    bannerImagesRaw: '[]',
    detailImagesRaw: '[]',
    avatarsRaw: '[]',
    ctaReportText: '',
    ctaSignupText: '',
    merchantId: '',
  });

  const parsedHighlights = useMemo(() => parseJsonArray(form.highlightsRaw), [form.highlightsRaw]);
  const parsedBannerImages = useMemo(
    () => parseJsonArray(form.bannerImagesRaw),
    [form.bannerImagesRaw]
  );
  const parsedDetailImages = useMemo(
    () => parseJsonArray(form.detailImagesRaw),
    [form.detailImagesRaw]
  );
  const parsedAvatars = useMemo(() => parseJsonArray(form.avatarsRaw), [form.avatarsRaw]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const payload = await apiGet(`/api/activities/${id}`);
        const entry = normalizeActivity(payload?.data);
        if (!entry) throw new Error('Activity not found.');
        if (!alive) return;
        setActivity(entry);
        setForm({
          meta_title: entry.meta_title || '',
          meta_version: entry.meta_version || '',
          slug: entry.slug || '',
          activityStatus: entry.activityStatus || entry.status || 'draft',
          startTime: toDate(entry.startTime),
          endTime: toDate(entry.endTime),
          minDiscountCount: entry.minDiscountCount ?? 0,
          currentOrderCount: entry.currentOrderCount ?? 0,
          sort: entry.sort ?? 100,
          highlightsRaw: JSON.stringify(entry.highlights || [], null, 2),
          bannerImagesRaw: JSON.stringify(
            (entry.banner?.images || []).map((img) => img.url || ''),
            null,
            2
          ),
          detailImagesRaw: JSON.stringify(
            (entry.detailImages || []).map((img) => img.url || ''),
            null,
            2
          ),
          avatarsRaw: JSON.stringify(
            (entry.avatars || []).map((item) => ({
              name: item.name,
              avatarUrl: item.avatarUrl,
              phoneMask: item.phoneMask,
            })),
            null,
            2
          ),
          ctaReportText: entry.ctas?.reportText || '',
          ctaSignupText: entry.ctas?.signupText || '',
          merchantId: entry.merchant?.id ? String(entry.merchant.id) : '',
        });
      } catch (err) {
        if (alive) setError(err.message || 'Failed to load activity.');
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    let alive = true;
    apiGet('/api/merchants')
      .then((payload) => {
        const list = (payload?.data || []).map(normalizeEntity).filter(Boolean);
        if (alive) setMerchants(list);
      })
      .catch(() => {
        if (alive) setMerchants([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const updateField = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateBannerImages = (nextItems) => {
    updateField('bannerImagesRaw')(JSON.stringify(nextItems || [], null, 2));
  };

  const onBannerUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setUploadingBanner(true);
    setError('');
    try {
      const uploaded = await apiUploadFiles(files);
      const uploadedUrls = (uploaded || []).map((item) => item.url).filter(Boolean);
      const current = parsedBannerImages || [];
      updateBannerImages([...current, ...uploadedUrls]);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploadingBanner(false);
      event.target.value = '';
    }
  };

  const validateJsonInputs = () => {
    if (!parsedHighlights) return 'Highlights must be valid JSON array.';
    if (!parsedBannerImages) return 'Banner images must be valid JSON array.';
    if (!parsedDetailImages) return 'Detail images must be valid JSON array.';
    if (!parsedAvatars) return 'Avatars must be valid JSON array.';
    return '';
  };

  const buildPayload = (nextStatus) => {
    const merchantId = form.merchantId ? Number(form.merchantId) : null;
    const ctas = form.ctaReportText || form.ctaSignupText ? {
      reportText: form.ctaReportText,
      signupText: form.ctaSignupText,
    } : null;

    return {
      data: {
        meta_title: form.meta_title,
        meta_version: form.meta_version,
        slug: form.slug,
        activityStatus: nextStatus || form.activityStatus,
        startTime: toIso(form.startTime),
        endTime: toIso(form.endTime),
        minDiscountCount: Number(form.minDiscountCount || 0),
        currentOrderCount: Number(form.currentOrderCount || 0),
        sort: Number(form.sort || 0),
        highlights: parsedHighlights || [],
        banner: {
          images: toImageItems(parsedBannerImages || []),
        },
        detailImages: toImageItems(parsedDetailImages || []),
        avatars: toAvatarItems(parsedAvatars || []),
        ctas,
        merchant: merchantId || null,
      },
    };
  };

  const onSave = async (nextStatus) => {
    const jsonError = validateJsonInputs();
    if (jsonError) {
      setError(jsonError);
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await apiPut(`/api/activities/${id}`, buildPayload(nextStatus));
      setNotice('Saved successfully.');
      if (nextStatus) {
        setForm((prev) => ({ ...prev, activityStatus: nextStatus }));
      }
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const tabValue = form.activityStatus === 'online' ? 'published' : 'draft';

  if (loading) {
    return (
      <Box padding={6} background="neutral100" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box padding={6} background="neutral100" minHeight="100vh">
        <Status variant="danger">{error || 'Activity not found.'}</Status>
      </Box>
    );
  }

  return (
    <Box padding={6} background="neutral100" minHeight="100vh">
      <Flex direction="column" gap={4}>
        <Flex alignItems="center" gap={3} wrap="wrap">
          <Button as={Link} to="/" startIcon={<ArrowLeft />} variant="tertiary">
            返回
          </Button>
          <Box>
            <Typography variant="alpha">{activity.meta_title || 'Activity'}</Typography>
            <Flex gap={2} paddingTop={2} alignItems="center">
              <Badge variant={statusBadgeVariant(form.activityStatus)}>
                {form.activityStatus || 'draft'}
              </Badge>
              <Typography variant="sigma" textColor="neutral600">
                ID: {activity.id}
              </Typography>
            </Flex>
          </Box>
        </Flex>

        <Tabs.Root
          value={tabValue}
          onValueChange={(value) => {
            if (value === 'published') updateField('activityStatus')('online');
            if (value === 'draft') updateField('activityStatus')('draft');
          }}
          variant="simple"
        >
          <Tabs.List aria-label="Activity status tabs">
            <Tabs.Trigger value="draft">DRAFT</Tabs.Trigger>
            <Tabs.Trigger value="published">PUBLISHED</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        {error ? <Status variant="danger">{error}</Status> : null}
        {notice ? <Status variant="success">{notice}</Status> : null}

        <Flex alignItems="flex-start" gap={4} wrap="wrap">
          <Box
            background="neutral0"
            padding={5}
            hasRadius
            shadow="tableShadow"
            flex="1"
            minWidth="340px"
          >
            <Section title="活动时间">
              <Flex gap={4} wrap="wrap">
                <DateTimePicker
                  label="endTime"
                  value={form.endTime}
                  onChange={updateField('endTime')}
                  required
                />

                <DateTimePicker
                  label="startTime"
                  value={form.startTime}
                  onChange={updateField('startTime')}
                />
              </Flex>
            </Section>

            <Divider />

            <Section title="Highlights" description="JSON 数组，展示活动亮点">
              <JSONInput
                id="highlights"
                value={form.highlightsRaw}
                onChange={updateField('highlightsRaw')}
              />
            </Section>

            <Divider />

            <Section title="统计信息">
              <Flex gap={4} wrap="wrap">
                <NumberInput
                  label="minDiscountCount"
                  value={form.minDiscountCount}
                  onValueChange={updateField('minDiscountCount')}
                />
                <NumberInput
                  label="currentOrderCount"
                  value={form.currentOrderCount}
                  onValueChange={updateField('currentOrderCount')}
                />
                <NumberInput
                  label="sort"
                  value={form.sort}
                  onValueChange={updateField('sort')}
                />
              </Flex>
            </Section>

            <Divider />

            <Section title="媒体">
              <Flex direction="column" gap={4}>
                <BannerImages
                  items={parsedBannerImages || []}
                  onChange={updateBannerImages}
                  onUpload={onBannerUpload}
                  uploading={uploadingBanner}
                />
                <Box>
                  <Typography variant="pi" fontWeight="bold">
                    detailImages
                  </Typography>
                  <JSONInput
                    id="detail-images"
                    value={form.detailImagesRaw}
                    onChange={updateField('detailImagesRaw')}
                  />
                </Box>
                <Box>
                  <Typography variant="pi" fontWeight="bold">
                    avatars
                  </Typography>
                  <JSONInput
                    id="avatars"
                    value={form.avatarsRaw}
                    onChange={updateField('avatarsRaw')}
                  />
                </Box>
              </Flex>
            </Section>

            <Divider />

            <Section title="CTA 文案">
              <Flex gap={4} wrap="wrap">
                <TextInput
                  label="reportText"
                  value={form.ctaReportText}
                  onChange={(e) => updateField('ctaReportText')(e.target.value)}
                />
                <TextInput
                  label="signupText"
                  value={form.ctaSignupText}
                  onChange={(e) => updateField('ctaSignupText')(e.target.value)}
                />
              </Flex>
            </Section>

            <Divider />

            <Section title="基础信息">
              <Flex gap={4} wrap="wrap">
                <TextInput
                  label="meta_title"
                  value={form.meta_title}
                  onChange={(e) => updateField('meta_title')(e.target.value)}
                />

                <TextInput
                  label="meta_version"
                  value={form.meta_version}
                  onChange={(e) => updateField('meta_version')(e.target.value)}
                />

                <TextInput
                  label="slug"
                  value={form.slug}
                  onChange={(e) => updateField('slug')(e.target.value)}
                />
              </Flex>
            </Section>

            <Divider />

            <Section title="关联商家">
              <SingleSelect
                label="merchant"
                value={form.merchantId}
                onChange={updateField('merchantId')}
                placeholder="选择商家"
              >
                <SingleSelectOption value="">None</SingleSelectOption>
                {merchants.map((merchant) => (
                  <SingleSelectOption key={merchant.id} value={String(merchant.id)}>
                    {merchant.name || `#${merchant.id}`}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </Section>

            <Divider />

            <Section title="活动状态">
              <SingleSelect
                label="activityStatus"
                value={form.activityStatus}
                onChange={updateField('activityStatus')}
              >
                {statusOptions.map((value) => (
                  <SingleSelectOption key={value} value={value}>
                    {value}
                  </SingleSelectOption>
                ))}
              </SingleSelect>
            </Section>
          </Box>

          <Box background="neutral0" padding={4} hasRadius shadow="tableShadow" minWidth="260px">
            <Flex direction="column" gap={3}>
              <Typography variant="epsilon">ENTRY</Typography>
              <Button onClick={() => onSave('online')} loading={saving} fullWidth>
                发布
              </Button>
              <Button variant="secondary" onClick={() => onSave()} loading={saving} fullWidth>
                保存
              </Button>
              <Button variant="tertiary" fullWidth onClick={() => navigate(0)}>
                刷新
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
