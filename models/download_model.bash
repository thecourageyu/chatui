#!/bin/bash

export HF_HOME="/work/models/huggingface"
export HF_DATASETS_CACHE="/work/models/huggingface/datasets"
export TRANSFORMERS_CACHE="/work/models/huggingface/models"

USER_NAME="meta-llama"
MODEL_NAME="Llama-3.2-3B-Instruct"

# WORK_DIR="/home/foxconnhy/yzk/models"
WORK_DIR="./"



export GIT_LFS_SKIP_SMUDGE=1

mkdir -p ${WORK_DIR}/${MODEL_NAME}
cd ${WORK_DIR}

git lfs install
git clone https://huggingface.co/$USER_NAME/$MODEL_NAME  # username: NiceYuPi, password: YZKRead token
cd ${MODEL_NAME}

git lfs pull --include="*.pt"
git lfs pull --include="*.bin"
rm -rf .git/lfs/objects
git lfs pull --include="*.safetensors"
rm -rf .git/lfs/objects
git lfs pull --include="tokenizer.model"
rm -rf .git/lfs/objects

