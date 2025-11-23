'use client';

import { useEffect, useState } from 'react';
import { vendorsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function VendorsPage() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const res = await vendorsAPI.getAll();
            setVendors(res.data);
        } catch (error) {
            toast.error('Failed to load vendors');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVendor = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await vendorsAPI.create({
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country'),
            });
            toast.success('Vendor created successfully');
            setShowCreateModal(false);
            loadVendors();
        } catch (error) {
            toast.error('Failed to create vendor');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
                <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                    <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Vendor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vendors.map((vendor) => (
                    <div key={vendor.id} className="card-hover">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                    {vendor.email && (
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {vendor.email}
                                        </div>
                                    )}
                                    {vendor.phone && (
                                        <div className="flex items-center gap-2">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {vendor.phone}
                                        </div>
                                    )}
                                </div>
                                {vendor._count && (
                                    <div className="mt-3 text-sm text-gray-500">
                                        {vendor._count.expenses} expenses
                                    </div>
                                )}
                            </div>
                            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-lg">
                                {vendor.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
                        <h2 className="text-2xl font-bold mb-6">Add New Vendor</h2>
                        <form onSubmit={handleCreateVendor} className="space-y-4">
                            <div>
                                <label className="label">Name *</label>
                                <input type="text" name="name" required className="input" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Email</label>
                                    <input type="email" name="email" className="input" />
                                </div>
                                <div>
                                    <label className="label">Phone</label>
                                    <input type="tel" name="phone" className="input" />
                                </div>
                            </div>
                            <div>
                                <label className="label">Address</label>
                                <input type="text" name="address" className="input" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="label">City</label>
                                    <input type="text" name="city" className="input" />
                                </div>
                                <div>
                                    <label className="label">State</label>
                                    <input type="text" name="state" className="input" />
                                </div>
                                <div>
                                    <label className="label">ZIP Code</label>
                                    <input type="text" name="zipCode" className="input" />
                                </div>
                            </div>
                            <div>
                                <label className="label">Country</label>
                                <input type="text" name="country" className="input" defaultValue="US" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="btn-primary flex-1">Add Vendor</button>
                                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
