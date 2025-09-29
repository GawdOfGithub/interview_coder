import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const PerformanceChart = ({ correct, incorrect }) => {
	const data = [
		{ name: 'Correct', value: correct },
		{ name: 'Incorrect', value: incorrect },
	];
	const COLORS = ['#10B981', '#EF4444'];

	return (
		<ResponsiveContainer width="100%" height={200}>
			<PieChart>
				<Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip contentStyle={{ background: '#1E293B', borderColor: '#334155', borderRadius: '0.5rem' }} />
			</PieChart>
		</ResponsiveContainer>
	);
};

export default PerformanceChart;


