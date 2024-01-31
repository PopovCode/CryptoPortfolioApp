import { Button, Drawer, Layout, Modal, Select, Space } from "antd";
import { useCrypto } from "../../contex/crypto-context.jsx";
import { useEffect, useState } from "react";
import CoinInfoModal from "../CoinInfoModal.jsx";
import AddAssetForm from "../AddAssetForm.jsx";

const headerStyle = {
	width: "100%",
	height: 60,
	padding: "1rem",
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
};

export default function AppHeader() {
	const { crypto } = useCrypto();
	const [select, setSelect] = useState(false);
	const [coin, setCoin] = useState(null);
	const [modal, setModal] = useState(false);
	const [drawer, setDrawer] = useState(true);

	useEffect(() => {
		const keypress = (event) => {
			if (event.key === "/") {
				setSelect((prev) => !prev);
			}
		};
		document.addEventListener("keypress", keypress);
		return () => document.removeEventListener("keypress", keypress);
	}, []);

	function handleSelect(value) {
		setCoin(crypto.find((c) => c.id === value));
		setModal(true);
	}

	return (
		<Layout.Header style={headerStyle}>
			<Select
				style={{
					width: 250,
				}}
				open={select}
				onSelect={handleSelect}
				onClick={() => setSelect((prev) => !prev)}
				value={"press / to open"}
				options={crypto.map((coin) => ({
					label: coin.name,
					value: coin.id,
					icon: coin.icon,
				}))}
				optionRender={(option) => (
					<Space>
						<img
							style={{ width: 20 }}
							src={option.data.icon}
							alt={option.data.label}
						/>{" "}
						{option.data.label}
					</Space>
				)}
			/>
			<Button type="primary" onClick={() => setDrawer(true)}>
				Add asset
			</Button>

			<Modal open={modal} onCancel={() => setModal(false)} footer={null}>
				<CoinInfoModal coin={coin} />
			</Modal>

			<Drawer
				title="Add asset"
				width={600}
				onClose={() => setDrawer((prew) => !prew)}
				open={drawer}
				destroyOnClose={true}
			>
				<AddAssetForm />
			</Drawer>
		</Layout.Header>
	);
}
