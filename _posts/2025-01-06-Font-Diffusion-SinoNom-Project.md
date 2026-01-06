---
layout: post
title: Dự Án Font Diffusion Sino Nom
subtitle: Tổng kết những gì đã thực hiện trong module FontDiffusion trong dự án Tạo sinh Tự Điển Hán Nôm Tự Động
cover-img:
thumbnail-img:
share-img:
tags: [learning-journey, diffusion]
author: dzungphieuluuky
---

# Báo Cáo Tóm Tắt Dự Án FontDiffusion

## Giới Thiệu
Dự án FontDiffusion là một bộ công cụ toàn diện để tạo và quản lý dữ liệu hình ảnh font chữ sử dụng mô hình khuếch tán (diffusion models). Dự án này tập trung vào việc tạo ra các hình ảnh font chữ với các kiểu dáng khác nhau, đào tạo mô hình, và quản lý tập dữ liệu. Các file được cung cấp là các module Python chính, hỗ trợ từ việc tạo dữ liệu hàng loạt, đào tạo mô hình, đến xuất/nhập tập dữ liệu từ Hugging Face.

Dự án này được xây dựng dựa trên các thư viện như PyTorch, Hugging Face Transformers, và Accelerate để hỗ trợ đa GPU. Nó bao gồm các tính năng như tạo hình ảnh batch, đánh giá chất lượng, chia tập dữ liệu, và tích hợp với Hugging Face Hub.

## Những Gì Đã Được Thực Hiện
Dự án đã triển khai một pipeline hoàn chỉnh cho việc xử lý font chữ với mô hình khuếch tán:
- **Pipeline tạo dataset**: Tạo hình ảnh font chữ với nhiều ảnh content và ảnh style, cụ thể là các ảnh content từ dữ liệu Hán Nôm Tự Tạo do thầy Điền cung cấp và 15 ảnh style tự sưu tầm trên Internet.
- **Module FST từ bài báo FSTDiff**: Có code tích hợp module Style Transformation Module từ bài báo FSTDiff mặc dù chưa train chưa thành công với module này vì còn gặp nhiều lỗi về tensor dimension và cần phải tích hợp vào pipeline đang có của FontDiffuser.
- **Quản lý Dataset**: Quản lý download/upload dataset từ Hugging Face về máy và ngược lại với tốc độ rất nhanh (xử lý bằng định dạng parquet được dùng trong bigdata nên nhanh hơn hẳn so với việc download/upload file thô, có hướng dẫn sử dụng bên dưới), chia tập train/val.
- **Đánh giá**: Có tích hợp module tính toán các chỉ số chất lượng như LPIPS, SSIM, FID.
- **Hỗ trợ đa GPU**: Sử dụng Accelerate library để hỗ trợ inference và training phân tán trên nhiều GPU cùng lúc, điển hình như tận dụng cả 2 GPU của Kaggle.
- **Tích hợp checkpoint**: Sử dụng `results_checkpoint.json` trong mỗi thư mục train_original, train và val để quản lý các data đã sinh bằng mã hash đi kèm của mỗi sample.

Các module chính được triển khai bao gồm:
- Quản lý font chữ (FontManager).
- Theo dõi quá trình tạo (GenerationTracker).
- Đánh giá chất lượng (QualityEvaluator).
- Tích hợp với WandB cho logging.

Các file dùng để inference gồm có:
- `sample_batch.py`: Đây là file dùng để inference trên 1 GPU.
- `sample_batch_multi_gpus.py`: Đây là file dùng để inference phân tán trên nhiều GPU cùng lúc để tận dụng tối đa quota của Kaggle. Hiện file này đang được dùng chính vì có thể tự động inference bình thường trong trường hợp 1 GPU (Google Colab).

## Cách Sử Dung Chung
Từ file `font_diffusion.ipynb` bên dưới, chỉ cần khởi chạy các cell theo mong muốn trong notebook là được. Vì notebook sẽ git clone toàn bộ repo về kho lưu trữ tạm thời trên nền tảng Cloud (Kaggle, Colab) và dùng các file trong đó để chạy.

### Ví Dụ Sử Dung Cơ Bản:
- Tạo dữ liệu: `python sample_batch.py --characters chars.txt --style_images styles/ --output_dir output/`
- Đào tạo: `python my_train.py --enable_style_transform --output_dir checkpoints/`
- Xuất dataset: `python create_hf_dataset.py --data-dir data/ --repo-id user/dataset`

## Mô Tả Chi Tiết Các Module

### 1. `sample_batch.py`
**Mục đích**: Script chính để tạo hình ảnh font chữ hàng loạt và đánh giá chất lượng. Nó sử dụng hash-based file naming để tránh trùng lặp và hỗ trợ resume từ checkpoint.

**Chức năng chính**:
- Tải danh sách ký tự từ file hoặc chuỗi.
- Tải hình ảnh style từ thư mục hoặc file.
- Tạo hình ảnh content (ký tự) và target (font với style).
- Đánh giá với LPIPS, SSIM, FID nếu có ground truth.
- Lưu kết quả vào `results_checkpoint.json`.

**Cách sử dụng**:
- Chạy: `python sample_batch.py --characters chars.txt --style_images styles/ --output_dir output/ --enable_style_transform`
- Tham số quan trọng: `--start_line`, `--end_line` để chọn range ký tự; `--evaluate` để đánh giá; `--use_wandb` để log.

**Khi git clone**: Sử dụng để tạo tập dữ liệu ban đầu. Đảm bảo có font file và style images.

### 2. `export_hf_dataset_to_disk.py`
**Mục đích**: Xuất tập dữ liệu từ Hugging Face Hub hoặc local cache về cấu trúc thư mục FontDiffusion gốc.

**Chức năng chính**:
- Tải dataset từ HF Hub hoặc disk.
- Tái tạo cấu trúc `ContentImage/` và `TargetImage/`.
- Lưu `results_checkpoint.json` làm nguồn chân lý.

**Cách sử dụng**:
- Chạy: `python export_hf_dataset_to_disk.py --output-dir ./output --repo-id user/dataset`
- Tham số: `--repo-id` cho Hub, `--local-path` cho local dataset.

**Khi git clone**: Sử dụng để tải dataset từ HF và chuyển về format local để chỉnh sửa hoặc đào tạo thêm.

### 3. `create_validation_split.py`
**Mục đích**: Chia tập dữ liệu training thành train/val splits với checkpoint filtering để đảm bảo tính nhất quán.

**Chức năng chính**:
- Phân tích dữ liệu hiện có, kiểm tra cặp content-target.
- Chia ngẫu nhiên ký tự và style thành train/val.
- Lọc checkpoint để chỉ giữ generations phù hợp.
- Xuất file `unparseable_files.txt` cho debugging.

**Cách sử dụng**:
- Chạy: `python create_validation_split.py --data_root data/ --val_ratio 0.2 --seed 42`
- Tham số: `--data_root` là thư mục gốc, `--val_ratio` tỷ lệ validation.

**Khi git clone**: Chạy sau khi tạo dữ liệu để chuẩn bị cho đào tạo. Đảm bảo có `results_checkpoint.json` trong thư mục train.

### 4. `create_hf_dataset.py`
**Mục đích**: Tạo tập dữ liệu Hugging Face từ hình ảnh FontDiffusion đã tạo.

**Chức năng chính**:
- Tải metadata từ `results_checkpoint.json`.
- Chuyển đổi hình ảnh thành format HF Dataset.
- Push lên HF Hub nếu cần.

**Cách sử dụng**:
- Chạy: `python create_hf_dataset.py --data-dir data/ --repo-id user/dataset --push`
- Tham số: `--private` để repo private, `--local-save` để lưu local.

**Khi git clone**: Sử dụng để publish dataset lên HF sau khi tạo xong.

### 5. `my_train.py`
**Mục đích**: Script đào tạo FontDiffuser với hỗ trợ đa giai đoạn (Phase 1 và Phase 2).

**Chức năng chính**:
- Hỗ trợ Style Transformation Module.
- Đào tạo với loss như diffusion, perceptual, offset, và SC (Phase 2).
- Sử dụng Accelerate cho distributed training.
- Log lên WandB.

**Cách sử dụng**:
- Chạy: `python my_train.py --enable_style_transform --phase_2 --output_dir checkpoints/`
- Tham số: `--max_train_steps`, `--batch_size`, `--learning_rate`.

**Khi git clone**: Sử dụng để đào tạo mô hình. Cần có dataset đã chuẩn bị và checkpoint từ Phase 1 nếu cần.

### 6. `sample_batch_multi_gpus.py`
**Mục đích**: Phiên bản đa GPU của `sample_batch.py` sử dụng Accelerate để phân phối tải.

**Chức năng chính**:
- Tương tự `sample_batch.py` nhưng hỗ trợ multi-GPU.
- Phân chia công việc theo style và ký tự.
- Tích hợp với Accelerate để quản lý distributed.

**Cách sử dụng**:
- Chạy: `accelerate launch sample_batch_multi_gpus.py --characters chars.txt --style_images styles/ --output_dir output/`
- Tham số: Giống `sample_batch.py`, nhưng cần `accelerate config` trước.

**Khi git clone**: Sử dụng khi có nhiều GPU để tăng tốc tạo dữ liệu. Đảm bảo cài Accelerate và cấu hình đúng.

## Kết Luận
Dự án FontDiffusion cung cấp một bộ công cụ mạnh mẽ và toàn diện cho việc nghiên cứu và ứng dụng font chữ với AI. Từ việc tạo dữ liệu, đào tạo mô hình, đến quản lý dataset, tất cả đều được tích hợp chặt chẽ. Khi `git clone`, bạn có thể bắt đầu bằng cách tạo dữ liệu với `sample_batch.py`, sau đó đào tạo với `my_train.py`, và cuối cùng xuất dataset với `create_hf_dataset.py`. Đảm bảo đọc docstring trong code và sử dụng `--help` để xem chi tiết tham số. Nếu gặp vấn đề, kiểm tra `results_checkpoint.json` và log files.