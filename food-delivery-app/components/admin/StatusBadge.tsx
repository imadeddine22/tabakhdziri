'use client';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface StatusBadgeProps {
    status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStyles = () => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'preparing':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'ready':
                return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'delivered':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getLabel = () => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'confirmed': return 'Confirmée';
            case 'preparing': return 'En préparation';
            case 'ready': return 'Prêt';
            case 'delivered': return 'Livrée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStyles()}`}>
            {getLabel()}
        </span>
    );
}
