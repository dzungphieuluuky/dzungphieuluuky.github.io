---
layout: post
title: Font Diffusion Sino Nom Project
subtitle: Tổng kết thực hiện module FontDiffusion - Dự án Tạo sinh Tự Điển Hán Nôm Tự Động
cover-img:
thumbnail-img:
share-img:
tags: [learning-journey, diffusion, sino-nom, deep-learning]
author: dzungphieuluuky
---

# Báo Cáo Tổng Kết: FontDiffusion Sino Nom

## 1. Giới Thiệu Chung

Đồ án này tập trung xây dựng module FontDiffusion sử dụng **PyTorch**, **Hugging Face Diffusers (HF Diffusers)**, và **Accelerate** để hỗ trợ huấn luyện và suy luận trên đa GPU. Hệ thống bao gồm các tính năng từ tạo hình ảnh song song theo lô (batch generation), đánh giá chất lượng, quản lý dữ liệu, đến tích hợp với Hugging Face Hub (HF Hub) để tối ưu hóa lưu trữ bằng Cloud của Huggingface.

## 2. Những Kết Quả Đạt Được

### Các tính năng chính

- **Pipeline tạo dataset:** Tạo hình ảnh font chữ dựa trên ảnh content (Hán Nôm Tự Tạo do thầy Điền cung cấp) và 15 ảnh style sưu tầm (tiềm năng cần sưu tầm thêm ảnh style để dataset đa dạng hơn, vì training phase 2 lấy default là 16 ảnh negative style để setup cho kĩ thuật constrastive learning).
- **Hỗ trợ đa GPU:** Tích hợp thư viện Accelerate cho phép inference và training phân tán, tận dụng tối đa tài nguyên (ví dụ: 2 GPU Kaggle).
- **Quản lý Dataset:** Sử dụng định dạng **parquet** (Apache Arrow) giúp tốc độ upload/download từ Hugging Face nhanh vượt trội so với file thô.
- **Module Đánh giá:** Tích hợp sẵn các chỉ số LPIPS, SSIM, FID.
- **Tích hợp Checkpoint:** Quản lý resume quá trình sinh dữ liệu thông qua `results_checkpoint.json`.

### Các module đã triển khai

- Quản lý font chữ (`FontManager`).
- Theo dõi quá trình tạo data (`GenerationTracker`).
- Đánh giá chất lượng (`QualityEvaluator`).
- Logging quá trình với **WandB**.
- Thử nghiệm module **FST (Font Style Transformation)** từ bài báo FSTDiff (đang trong giai đoạn debug tensor dimension).

---

## 3. Chi Tiết Cấu Trúc Source Code

Dưới đây là mô tả chức năng của các script chính trong repository:

### Nhóm Inference & Data Generation

| Filename | Chức năng |
| :--- | :--- |
| **`sample_batch.py`** | Script tạo ảnh và đánh giá trên **1 GPU**. Sử dụng hash để tránh trùng lặp và hỗ trợ resume. |
| **`sample_batch_multi_gpus.py`** | Phiên bản **đa GPU** (Recommended). Tăng tốc độ sinh dữ liệu (gấp đôi so với đơn GPU), đạt ~1.7s/sample. |

### Nhóm Quản lý Dataset

| Filename | Chức năng |
| :--- | :--- |
| **`create_hf_dataset.py`** | Chuyển đổi ảnh sang format HF Dataset (parquet) và upload lên Hub. |
| **`export_hf_dataset_to_disk.py`** | Tải dataset từ HF và giải nén thành cấu trúc thư mục chuẩn (`ContentImage/`, `TargetImage/`) để training. |
| **`create_validation_split.py`** | Chia tập dữ liệu thành Train/Val dựa trên tỷ lệ và seed, đảm bảo tính ngẫu nhiên của font/style. |

### Nhóm Training

| Filename | Chức năng |
| :--- | :--- |
| **`my_train.py`** | Script training chính. Hỗ trợ 2 phase, loss diffusion/perceptual/offset/SC, và distributed training với Accelerate. |

---

## 4. Hướng Dẫn Sử Dụng

*Lưu ý: Notebook `font_diffusion.ipynb` (link bên dưới) đã thiết lập sẵn môi trường, chỉ cần chạy các cell theo thứ tự.*

### Bước 1: Data Generation

Sinh data bằng inference phân tán trên nhiều GPU:

```bash
accelerate launch FontDiffusion/sample_batch_multi_gpus.py \
    --characters "NomTuTao/Ds_10k_ChuNom_TuTao.txt" \
    --style_images "FontDiffusion/styles_images" \
    --ckpt_dir "ckpt/" \
    --ttf_path "FontDiffusion/fonts/NomNaTong-Regular.otf" \
    --output_dir "my_dataset/train_original" \
    --num_inference_steps 20 \
    --guidance_scale 7.5 \
    --start_line 3001 \
    --end_line 3200 \
    --batch_size 35 \
    --save_interval 1 \
    --channels_last \
    --seed 42 \
    --compile \
    --enable_xformers
```

### Bước 2: Chia tập Train/Validation

Ví dụ `val_ratio` là 0.2:

```bash
python FontDiffusion/create_validation_split.py \
  --data_root my_dataset \
  --val_ratio 0.2 \
  --seed 42
```

### Bước 3: Training Model

Ví dụ cấu hình training Phase 1:

```bash
MAX_TRAIN_STEPS=1500
accelerate launch FontDiffusion/my_train.py \
    --seed=123 \
    --experience_name="FontDiffuser_training_phase_1" \
    --data_root="my_dataset" \
    --output_dir="outputs/FontDiffuser" \
    --phase_1_ckpt_dir="ckpt" \
    --report_to="wandb" \
    --resolution=96 \
    --style_image_size=96 \
    --content_image_size=96 \
    --content_encoder_downsample_size=3 \
    --channel_attn=True \
    --content_start_channel=64 \
    --style_start_channel=64 \
    --train_batch_size=16 \
    --gradient_accumulation_steps=2 \
    --perceptual_coefficient=0.07 \
    --offset_coefficient=0.6 \
    --max_train_steps={MAX_TRAIN_STEPS} \
    --ckpt_interval={MAX_TRAIN_STEPS // 4} \
    --log_interval=50 \
    --learning_rate=1e-4 \
    --lr_scheduler="cosine" \
    --lr_warmup_steps=200 \
    --drop_prob=0.1 \
    --mixed_precision="fp16"
```

### Bước 4: Upload/Download Dataset với Hugging Face

**Upload lên HF Hub:**

```bash
# Ví dụ cho tập Train Original
python FontDiffusion/create_hf_dataset.py \
  --data-dir "my_dataset/train_original" \
  --repo-id dzungpham/font-diffusion-generated-data \
  --split "train_original" \
  --token {HF_TOKEN}
```

**Download từ HF Hub về Disk:**

```bash
python FontDiffusion/export_hf_dataset_to_disk.py \
  --output-dir "my_dataset/train_original" \
  --repo-id {HF_USERNAME}/font-diffusion-generated-data \
  --split "train_original" \
  --token HF_TOKEN
```

---

## 5. Resources

- **Source Code (GitHub):** [https://github.com/dzungphieuluuky/FontDiffusion.git](https://github.com/dzungphieuluuky/FontDiffusion.git)
- **Notebook (Kaggle):** [https://www.kaggle.com/code/dzung271828/font-diffusion](https://www.kaggle.com/code/dzung271828/font-diffusion)
- **Dataset (Hugging Face):** [https://huggingface.co/datasets/dzungpham/font-diffusion-generated-data](https://huggingface.co/datasets/dzungpham/font-diffusion-generated-data)
  - **Train original:** Tổng lượng data đã generate.
  - **Train/Val:** Data đã split sẵn sàng cho training.
- **Pretrained Models (Weights):** Gồm có các module sau, đã được chuyển từ .pth sang .safetensors vì tốc độ nhanh hơn và tích hợp tốt với hệ sinh thái của HF:
  - content_encoder.safetensors
  - style_encoder.safetensors
  - unet.safetensors
  - scr_210000.pth (training phase 2)

  [https://huggingface.co/dzungpham/font-diffusion-weights](https://huggingface.co/dzungpham/font-diffusion-weights)

---

## 6. Kết Quả Thực Nghiệm (Weights and Biases)

Một số hình ảnh log từ quá trình train Phase 1 (Perceptual loss và Offset loss coefficient đã được điều chỉnh tăng so với script gốc):

| Loss Type | Chart |
| :--- | :--- |
| **Train Loss** | ![train loss](../figures/train_loss.png) |
| **Perceptual Loss** | ![percept loss](../figures/percept_loss.png) |
| **Offset Loss** | ![offset loss](../figures/offset_loss.png) |
| **Diffusion Loss** | ![diffusion loss](../figures/diff_loss.png) |

---

## 7. Hướng Tiếp Theo

1. **Cải thiện Model Architecture:** Model hiện tại gần như đã bão hòa, train loss không cải thiện đáng kể khi training với hệ số của các hàm loss cao hơn so với trước. Tiếp tục debug và tích hợp **Style Transformation Module** (từ FSTDiff) để tăng capacity cho model.
2. **Multi-scale Extraction:** Kết hợp cả 2 paper (FontDiffuser & FSTDiff) để áp dụng multi-scale feature extraction cho cả ảnh content và style.
3. **Tối ưu Loss:** Thêm hàm **Loss Consistency** và các hàm loss phụ trợ khác sau khi giải quyết xong các vấn đề về chiều tensor.
4. **Tập Validation Set:** Vì hiện tại chưa tích hợp với module đối sánh ảnh của Hưng nên chưa đánh giá toàn diện performance của module này được. Tập validation set của module này đặc biệt ở chỗ có thể chia thành 3 trường hợp:
   - Seen content unseen style (SCUS)
   - Unseen content seen style (UCSS)
   - Unseen content unseen style (UCUS)

   Do đó hủ yếu đánh giá trên tập UCUS, khi cần debug performance cụ thể cho 1 yếu tố nào thì có thể dùng 2 tập SCUS và UCSS để xét riêng content hoặc style.