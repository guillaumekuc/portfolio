/**
 * Utility class for tooltip operations
 */
export class Tooltip {
	/**
	 * Shows a mail tooltip when email link is clicked
	 * @param {Event} event - Click event
	 */
	static handleMailTooltip(event) {
		const toolTip = document.createElement('span');
		toolTip.innerHTML = "<span class='tooltipText'>Mail copied to clipboard !</span>";
		event.currentTarget.appendChild(toolTip);
		setTimeout(() => {
			if (event.currentTarget.contains(toolTip)) {
				event.currentTarget.removeChild(toolTip);
			}
		}, 3000);
	}
}
