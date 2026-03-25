import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Tự động cuộn lên đầu trang (vị trí 0, 0) mỗi khi pathname thay đổi
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; 
};

export default ScrollToTop;