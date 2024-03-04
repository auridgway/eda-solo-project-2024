import SvgIcon from '@mui/material/SvgIcon';
import { motion, AnimatePresence } from "framer-motion";

export default function D1() {

    return (
            <SvgIcon fontSize='large' color="primary" key={'one'}>
                <svg width="50px" height="50px" viewBox="0 0 16 16" class="bi bi-dice-1" fill="#166088" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M13 1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z" />
                    <circle cx="8" cy="8" r="1.5" />
                </svg>
            </SvgIcon>
    )
}
