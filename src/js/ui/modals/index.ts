import { AllowedComponentProps, Component, ref, shallowRef, ShallowRef, VNodeProps } from "vue";

import ChoosePathModal from "./ChoosePathModal.vue";
import HardResetModal from "./HardResetModal.vue";
import InfoModal from "./InfoModal.vue";
import MessageModal from "./MessageModal.vue";
import SettingsModal from "./SettingsModal.vue";

// https://stackoverflow.com/a/73784241/17814082
// Dear god
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentProps<C extends Component> = C extends new (...args: any) => any
  ? Omit<InstanceType<C>["$props"], keyof VNodeProps | keyof AllowedComponentProps>
  : never;

export class Modal<C extends Component> {
	_component: C;
	_props: ComponentProps<C>;
	_priority: number;
	afterHide?: () => void;
	constructor(component: C, priority = 0) {
		this._component = component;
		this._props = {} as ComponentProps<C>;
		this._priority = priority;
	}

	show(modalConfig?: ComponentProps<C>) {
		this._props = Object.assign({}, modalConfig);

		const modalQueue = Modals.queue;
		// Add this modal to the front of the queue and sort based on priority to ensure priority is maintained.
		modalQueue.unshift(this);
		Modals.sortModalQueue();
		return {
			then: (func: () => void) => {
				this.afterHide = func;
			}
		};
	}

	get isOpen(): boolean {
		return Modals.current.value === this;
	}

	get component() {
		return this._component;
	}

	get props() {
		return this._props;
	}

	get priority() {
		return this._priority;
	}
}

interface ModalType extends Modal<Component> { hide?: () => void }

export const Modals = {
	current: shallowRef(undefined) as ShallowRef<ModalType | undefined>,
	queue: [] as ModalType[],
	hide() {
		const closed = Modals.queue.shift();
		if (closed) {
			if (closed.afterHide) closed.afterHide();
			delete closed.afterHide;
		}
		if (Modals.queue.length === 0) Modals.current.value = undefined;
		else Modals.current.value = Modals.queue[0];
	},
	hideAll() {
		while (Modals.queue.length) {
			if (Modals.queue[0].hide) {
				Modals.queue[0].hide();
			} else {
				Modals.hide();
			}
		}
		Modals.current.value = undefined;
	},
	sortModalQueue() {
		const modalQueue = Modals.queue;
		modalQueue.sort((x, y) => y.priority - x.priority);
		// Filter out multiple instances of the same Modals.
		const singleQueue = [...new Set(modalQueue)];
		Modals.queue = singleQueue;
		Modals.current.value = singleQueue[0];
	},
	get isOpen() {
		return Modals.current.value !== undefined;
	},

	hardReset: new Modal(HardResetModal),
	info: new Modal(InfoModal),
	settings: new Modal(SettingsModal),
	choosePath: new Modal(ChoosePathModal),

	message: new (class extends Modal<typeof MessageModal> {
		queue: string[];
		text = ref("");

		constructor(component: typeof MessageModal, priority = 0) {
			super(component, priority);
			this.queue = [];
		}

		showText(text: string) {
			if (!this.queue.length) this.text.value = text;
			this.queue.push(text);
			return super.show();
		}

		hide() {
			if (this.queue.length <= 1) {
				Modals.hide();
			}
			this.queue.shift();
			if (this.queue && this.queue.length === 0) this.text.value = "";
			else this.text.value = this.queue[0];
		}
	})(MessageModal, 2),
};