import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import API from '../../services/api';
import ProduceImageUploader from '../../components/camera/ProduceImageUploader';
import Button3D from '../../components/ui/Button3D';
import { useLanguage } from '../../context/LanguageContext';

const FarmerProductFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { t, translateCategory, translateFarmingMethod, translateUnit, isTamil } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    quantityAvailable: '100',
    minimumOrderQuantity: '1',
    harvestDate: new Date().toISOString().split('T')[0],
    qualityGrade: 'Grade A',
    farmingMethod: 'Organic',
    state: '',
    city: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await API.get(`/products/${id}`);
          if (res.data.success) {
            const p = res.data.data;
            setFormData({
              name: p.name,
              description: p.description,
              category: p.category,
              price: p.price,
              unit: p.unit,
              quantityAvailable: p.quantityAvailable || '100',
              minimumOrderQuantity: p.minimumOrderQuantity || '1',
              harvestDate: new Date(p.harvestDate).toISOString().split('T')[0],
              qualityGrade: p.qualityGrade || 'Grade A',
              farmingMethod: p.farmingMethod || 'Organic',
              state: p.location?.state || '',
              city: p.location?.city || '',
              imageUrl: p.images?.[0] || '',
            });
          }
        } catch (err) {
          setError(isTamil ? 'விளைபொருள் விவரங்களைப் பெற முடியவில்லை' : 'Failed to fetch product details');
        }
      };
      fetchProduct();
    }
  }, [id, isEdit, isTamil]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const qty = Number(formData.quantityAvailable) > 0 ? Number(formData.quantityAvailable) : 50;
      const payload = {
        ...formData,
        price: Number(formData.price),
        quantityAvailable: qty,
        minimumOrderQuantity: Number(formData.minimumOrderQuantity) || 1,
        status: 'active',
        images: formData.imageUrl ? [formData.imageUrl] : [],
        imageUrl: formData.imageUrl || '',
      };

      if (isEdit) {
        await API.put(`/products/${id}`, payload);
        alert(t('farmer.updatedSuccess'));
      } else {
        await API.post('/products', payload);
        alert(t('farmer.createdSuccess'));
      }
      navigate('/farmer/products');
    } catch (err) {
      setError(err.response?.data?.message || (isTamil ? 'விளைபொருளைப் பதிவு செய்ய முடியவில்லை' : 'Failed to save product listing'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/farmer/products')}
        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-700"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> {t('farmer.backToProduce')}
      </button>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-black text-slate-900">
          {isEdit ? t('farmer.editTitle') : t('farmer.newTitle')}
        </h1>
        <p className="text-xs text-slate-500">{t('farmer.formSub')}</p>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">{t('farmer.produceName')}</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder={t('farmer.namePlaceholder')}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-700">{t('marketplace.category')}</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600 bg-white"
              >
                <option value="Vegetables">{translateCategory('Vegetables')}</option>
                <option value="Fruits">{translateCategory('Fruits')}</option>
                <option value="Grains">{translateCategory('Grains')}</option>
                <option value="Pulses">{translateCategory('Pulses')}</option>
                <option value="Spices">{translateCategory('Spices')}</option>
                <option value="Dairy">{translateCategory('Dairy')}</option>
                <option value="Other">{translateCategory('Other')}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">{t('farmer.farmingMethod')}</label>
              <select
                name="farmingMethod"
                value={formData.farmingMethod}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600 bg-white"
              >
                <option value="Organic">{translateFarmingMethod('Organic')}</option>
                <option value="Natural / Hydroponic">{translateFarmingMethod('Natural / Hydroponic')}</option>
                <option value="Conventional">{translateFarmingMethod('Conventional')}</option>
                <option value="Regenerative">{translateFarmingMethod('Regenerative')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-bold text-slate-700">{t('farmer.pricePerUnit')}</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="35"
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">{t('farmer.unit')}</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600 bg-white"
              >
                <option value="kg">{translateUnit('kg')}</option>
                <option value="quintal">{translateUnit('quintal')} (100 kg)</option>
                <option value="ton">{translateUnit('ton')} (1000 kg)</option>
                <option value="crate">{translateUnit('crate')}</option>
                <option value="liter">{translateUnit('liter')}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">{t('farmer.stockQty')}</label>
              <input
                type="number"
                name="quantityAvailable"
                required
                min="0"
                value={formData.quantityAvailable}
                onChange={handleChange}
                placeholder="1000"
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-700">{t('farmer.minQty')}</label>
              <input
                type="number"
                name="minimumOrderQuantity"
                required
                min="1"
                value={formData.minimumOrderQuantity}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">{t('farmer.harvestDate')}</label>
              <input
                type="date"
                name="harvestDate"
                required
                value={formData.harvestDate}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Real Camera / Harvest Photo Uploader */}
          <ProduceImageUploader
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            label={isTamil ? 'விளைபொருள் நேரடி அறுவடை புகைப்படம் (கேமரா அல்லது கோப்பு)' : 'Produce Real Harvest Photo (Camera or File)'}
          />

          <div>
            <label className="text-xs font-bold text-slate-700">{t('farmer.description')}</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder={t('farmer.descPlaceholder')}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold outline-none focus:border-emerald-600"
            />
          </div>

          <Button3D
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full shadow-emerald-900/20"
          >
            {loading ? t('farmer.savingProduce') : t('farmer.saveProduce')}
          </Button3D>
        </form>
      </div>
    </div>
  );
};

export default FarmerProductFormPage;
