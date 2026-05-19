import { defaultDailyInput } from '$lib/data/dailyInputDefaults.js';
import { loadDailyInput, saveDailyInput } from '$lib/storage/dailyInputStorage.js';

/**
 * @returns {{
 *   dailyInput: import('$lib/data/dailyInputDefaults.js').DailyInput,
 *   load: () => void,
 *   update: (dailyInput: import('$lib/data/dailyInputDefaults.js').DailyInput) => void
 * }}
 */
export function createDailyInputState() {
	const dailyInput = $state({ ...defaultDailyInput });

	function load() {
		Object.assign(dailyInput, loadDailyInput());
	}

	/**
	 * @param {import('$lib/data/dailyInputDefaults.js').DailyInput} nextDailyInput
	 */
	function update(nextDailyInput) {
		Object.assign(dailyInput, {
			...defaultDailyInput,
			...nextDailyInput
		});

		saveDailyInput(dailyInput);
	}

	return {
		dailyInput,
		load,
		update
	};
}