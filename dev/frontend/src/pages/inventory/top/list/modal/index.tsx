import { useInventoryModalPresenter } from "./presenter";
import { InventoryModalView } from "./view";

export const InventoryModal = () => {
	const { renderModal, showModal, mode } = useInventoryModalPresenter();
	const modal = <InventoryModalView mode={mode} renderModal={renderModal} />;
	return { modal, showModal };
};
