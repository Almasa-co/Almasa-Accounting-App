export function formatCurrency(amount: number | string, currency = 'EGP', symbol?: string) {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (symbol) {
        return `${symbol}${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value)}`;
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(value);
}

export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function getStatusColor(status: string) {
    const colors: Record<string, string> = {
        DRAFT: 'bg-gray-100 text-gray-800',
        SENT: 'bg-blue-100 text-blue-800',
        VIEWED: 'bg-purple-100 text-purple-800',
        APPROVED: 'bg-indigo-100 text-indigo-800',
        PARTIAL: 'bg-yellow-100 text-yellow-800',
        PAID: 'bg-green-100 text-green-800',
        OVERDUE: 'bg-red-100 text-red-800',
        CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

export function calculateDaysUntilDue(dueDate: string | Date) {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
}
